/**
 * Tests for game-state-check.ts
 *
 * Covers the three GSC conditions (§1.8.1.1, §1.8.1.2, §1.8.1.4) and their
 * cascade / iteration behaviour (§1.8.3, §1.8.4).
 *
 * Unit tests for the pure helper functions (`checkLoreWinCondition`,
 * `checkDeckEmptyForPlayer`) are kept lean and self-contained.
 *
 * Integration tests for `runGameStateCheck` use
 * `LorcanaMultiplayerTestEngine` via the multiplayer test harness so that
 * the full projection stack (effective Willpower, aura modifiers, triggers)
 * is exercised without requiring real card data.
 */

import { afterEach, describe, expect, it } from "bun:test";
import type { CardInstanceId, PlayerId } from "#core";
import {
  CANONICAL_PLAYER_ONE,
  CANONICAL_PLAYER_TWO,
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "../../testing";
import {
  checkDeckEmptyForPlayer,
  checkLoreWinCondition,
  DEFAULT_LORE_TO_WIN,
  runGameStateCheck,
} from "./game-state-check";

const PLAYER_ONE = CANONICAL_PLAYER_ONE as PlayerId;
const PLAYER_TWO = CANONICAL_PLAYER_TWO as PlayerId;

// ─────────────────────────────────────────────────────────────────────────────
// §1.8.1.1 — checkLoreWinCondition (pure unit tests)
// ─────────────────────────────────────────────────────────────────────────────

describe("checkLoreWinCondition (§1.8.1.1)", () => {
  it("returns undefined when no player has reached 20 lore", () => {
    const G = { lore: { [PLAYER_ONE]: 19, [PLAYER_TWO]: 15 }, loreToWin: undefined };
    expect(checkLoreWinCondition(G)).toBeUndefined();
  });

  it("returns the winner when a player reaches exactly 20 lore", () => {
    const G = { lore: { [PLAYER_ONE]: 20, [PLAYER_TWO]: 5 }, loreToWin: undefined };
    const result = checkLoreWinCondition(G);
    expect(result).toBeDefined();
    expect(result!.winner).toBe(PLAYER_ONE);
    expect(result!.loreToWin).toBe(DEFAULT_LORE_TO_WIN);
  });

  it("returns the winner when a player exceeds 20 lore", () => {
    const G = { lore: { [PLAYER_ONE]: 0, [PLAYER_TWO]: 25 }, loreToWin: undefined };
    const result = checkLoreWinCondition(G);
    expect(result).toBeDefined();
    expect(result!.winner).toBe(PLAYER_TWO);
  });

  it("respects a raised loreToWin threshold (win-condition-modification ability)", () => {
    // Donald Duck raises opponent's threshold to 25.
    const G = {
      lore: { [PLAYER_ONE]: 20, [PLAYER_TWO]: 5 },
      loreToWin: { [PLAYER_ONE]: 25 } as Record<PlayerId, number>,
    };
    // Player one has 20 lore but threshold is 25 → no winner yet.
    expect(checkLoreWinCondition(G)).toBeUndefined();
  });

  it("returns winner when lore meets the raised threshold exactly", () => {
    const G = {
      lore: { [PLAYER_ONE]: 25, [PLAYER_TWO]: 5 },
      loreToWin: { [PLAYER_ONE]: 25 } as Record<PlayerId, number>,
    };
    const result = checkLoreWinCondition(G);
    expect(result).toBeDefined();
    expect(result!.winner).toBe(PLAYER_ONE);
    expect(result!.loreToWin).toBe(25);
  });

  it("falls back to 20 for players not in loreToWin map", () => {
    // Only player one's threshold is raised; player two still uses 20.
    const G = {
      lore: { [PLAYER_ONE]: 10, [PLAYER_TWO]: 20 },
      loreToWin: { [PLAYER_ONE]: 25 } as Record<PlayerId, number>,
    };
    const result = checkLoreWinCondition(G);
    expect(result).toBeDefined();
    expect(result!.winner).toBe(PLAYER_TWO);
    expect(result!.loreToWin).toBe(20);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// §1.8.1.2 — checkDeckEmptyForPlayer (pure unit tests)
// ─────────────────────────────────────────────────────────────────────────────

describe("checkDeckEmptyForPlayer (§1.8.1.2)", () => {
  function makeDeckCtx(deckSize: number) {
    const deckCards = Array.from({ length: deckSize }, (_, i) => `card-${i}` as CardInstanceId);
    return {
      framework: {
        zones: {
          getCards: (_args: { zone: string; playerId: PlayerId }) => deckCards,
        },
      },
    };
  }

  it("returns true when deck is empty", () => {
    expect(checkDeckEmptyForPlayer(makeDeckCtx(0), PLAYER_ONE)).toBe(true);
  });

  it("returns false when deck has cards", () => {
    expect(checkDeckEmptyForPlayer(makeDeckCtx(5), PLAYER_ONE)).toBe(false);
  });

  it("returns false when deck has exactly one card", () => {
    expect(checkDeckEmptyForPlayer(makeDeckCtx(1), PLAYER_ONE)).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// §1.8.1.4 — runGameStateCheck / lethal damage (integration tests)
// ─────────────────────────────────────────────────────────────────────────────

describe("runGameStateCheck — lethal damage banishment (§1.8.1.4)", () => {
  let engine: LorcanaMultiplayerTestEngine;

  afterEach(() => {
    engine?.dispose();
  });

  // Helper to get the instance ID for a card definition in a given zone.
  function getInstanceIn(zone: string, playerId: PlayerId, definitionId: string): CardInstanceId {
    const id = engine
      .getCardInstanceIdsInZone(zone, playerId)
      .find((cid) => engine.getCardDefinitionId(cid) === definitionId);
    if (!id) {
      throw new Error(`No instance of '${definitionId}' in ${zone}:${playerId}`);
    }
    return id as CardInstanceId;
  }

  it("banishes a character whose damage equals its Willpower after a damage effect (§1.8.1.4)", () => {
    // manualSetDamage applies damage then calls runGameStateCheck (§1.8.1.4).
    // fragileSoldier (W=2) takes 2 damage → GSC detects lethal → banished.
    const fragileSoldier = createMockCharacter({
      id: "gsc-fragile-soldier",
      name: "Fragile Soldier",
      cost: 2,
      strength: 1,
      willpower: 2,
    });

    engine = LorcanaMultiplayerTestEngine.createWithFixture({}, { play: [fragileSoldier] });

    const serverEngine = engine.getServerEngine();
    const fragileSoldierId = getInstanceIn("play", PLAYER_TWO, fragileSoldier.id);

    const result = serverEngine.engine.executeMove("manualSetDamage", {
      args: { cardId: fragileSoldierId, damage: 2 },
    });

    expect(result.success).toBe(true);

    // GSC ran inside manualSetDamage: 2 damage >= 2 Willpower → banished.
    expect(serverEngine.getCardZone(fragileSoldierId)).toBe("discard");
  });

  it("banishes a location whose damage equals its Willpower (§1.8.1.4)", () => {
    const fragileLocation = createMockLocation({
      id: "gsc-fragile-location",
      name: "Fragile Location",
      cost: 2,
      willpower: 3,
      lore: 1,
    });

    const damageDealer = createMockCharacter({
      id: "gsc-location-attacker",
      name: "Location Attacker",
      cost: 3,
      strength: 3,
      willpower: 3,
    });

    engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [damageDealer] },
      { play: [fragileLocation] },
    );

    // Exert the attacker and challenge the location.
    const serverEngine = engine.getServerEngine();
    const attackerId = getInstanceIn("play", PLAYER_ONE, damageDealer.id);
    const locationId = getInstanceIn("play", PLAYER_TWO, fragileLocation.id);

    serverEngine.engine.executeMove("manualReadyCard", { args: { cardId: attackerId } });

    const challengeResult = serverEngine.engine.executeMove("challenge", {
      args: { attackerId, defenderId: locationId },
    });

    expect(challengeResult.success).toBe(true);

    // 3 damage >= 3 Willpower → location banished by GSC.
    expect(serverEngine.getCardZone(locationId)).toBe("discard");
  });

  it("character survives when damage is below its Willpower (§1.8.1.4 negative case)", () => {
    const toughCharacter = createMockCharacter({
      id: "gsc-tough-char",
      name: "Tough Character",
      cost: 3,
      strength: 1,
      willpower: 5,
    });

    const weakAttacker = createMockCharacter({
      id: "gsc-weak-attacker",
      name: "Weak Attacker",
      cost: 2,
      strength: 2,
      willpower: 2,
    });

    engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [weakAttacker] },
      { play: [toughCharacter] },
    );

    const serverEngine = engine.getServerEngine();
    const attackerId = getInstanceIn("play", PLAYER_ONE, weakAttacker.id);
    const toughId = getInstanceIn("play", PLAYER_TWO, toughCharacter.id);

    serverEngine.engine.executeMove("manualReadyCard", { args: { cardId: attackerId } });

    // Exert the defender for the challenge.
    serverEngine.engine.executeMove("manualExertCard", { args: { cardId: toughId } });

    const result = serverEngine.engine.executeMove("challenge", {
      args: { attackerId, defenderId: toughId },
    });

    expect(result.success).toBe(true);

    // 2 damage < 5 Willpower → still in play.
    expect(serverEngine.getCardZone(toughId)).toBe("play");
    expect(serverEngine.getDamage(toughId)).toBe(2);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// §1.8.3 — GSC repeats until stable (cascade)
// ─────────────────────────────────────────────────────────────────────────────

describe("runGameStateCheck — cascade / repeat until stable (§1.8.3)", () => {
  let engine: LorcanaMultiplayerTestEngine;

  afterEach(() => {
    engine?.dispose();
  });

  function getInstanceIn(zone: string, playerId: PlayerId, definitionId: string): CardInstanceId {
    const id = engine
      .getCardInstanceIdsInZone(zone, playerId)
      .find((cid) => engine.getCardDefinitionId(cid) === definitionId);
    if (!id) {
      throw new Error(`No instance of '${definitionId}' in ${zone}:${playerId}`);
    }
    return id as CardInstanceId;
  }

  it("cascades: banishing a +{W} aura source also banishes a now-lethal character (§1.8.3 Example B)", () => {
    // willpowerAura grants +2 W to your other characters (YOUR_OTHER_CHARACTERS).
    // fragileFish has printed Willpower 2; while the aura is in play effective W = 4.
    // Setting 2 damage on fragileFish keeps it alive (2 < 4).
    // Then setting lethal damage on the aura banishes it → cascade → fragileFish (now
    // effective W = 2, damage = 2) is also banished by the second GSC pass.
    const fragileFish = createMockCharacter({
      id: "gsc-fragile-fish",
      name: "Fragile Fish",
      cost: 2,
      strength: 1,
      willpower: 2,
    });

    const willpowerAura = createMockCharacter({
      id: "gsc-willpower-aura-source",
      name: "Willpower Aura Source",
      cost: 3,
      strength: 1,
      willpower: 3,
      abilities: [
        {
          id: "gsc-aura-source-1",
          text: "Your other characters get +2 {W}.",
          type: "static",
          effect: {
            type: "modify-stat",
            stat: "willpower",
            modifier: 2,
            target: "YOUR_OTHER_CHARACTERS",
          },
        },
      ],
    });

    engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {},
      { play: [fragileFish, willpowerAura] },
    );

    const serverEngine = engine.getServerEngine();
    const fragileFishId = getInstanceIn("play", PLAYER_TWO, fragileFish.id);
    const auraId = getInstanceIn("play", PLAYER_TWO, willpowerAura.id);

    // Apply 2 damage to fragileFish. Aura grants +2 W → effective W=4 → NOT lethal.
    serverEngine.engine.executeMove("manualSetDamage", {
      args: { cardId: fragileFishId, damage: 2 },
    });

    // Verify fragileFish is still alive (effective W=4 > damage=2).
    expect(serverEngine.getCardZone(fragileFishId)).toBe("play");

    // Banish the aura by setting lethal damage (3 >= 3 Willpower).
    serverEngine.engine.executeMove("manualSetDamage", {
      args: { cardId: auraId, damage: 3 },
    });

    // GSC pass 1: aura has 3 damage >= 3 Willpower → banished.
    // GSC pass 2 (cascade): fragileFish now has 2 damage >= 2 effective Willpower (aura gone) → banished.
    expect(serverEngine.getCardZone(auraId)).toBe("discard");
    expect(serverEngine.getCardZone(fragileFishId)).toBe("discard");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// §1.8.1.1 integration — lore win ends the game
// ─────────────────────────────────────────────────────────────────────────────

describe("Lore win condition integration (§1.8.1.1)", () => {
  let engine: LorcanaMultiplayerTestEngine;

  afterEach(() => {
    engine?.dispose();
  });

  it("ends the game when a player quests to exactly 20 lore", () => {
    const questingChar = createMockCharacter({
      id: "gsc-questing-char",
      name: "Questing Character",
      cost: 2,
      strength: 1,
      willpower: 3,
      lore: 1,
    });

    engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [questingChar], lore: 19 },
      { deck: 1 },
    );

    // Mark the character as dry so it can quest.
    const serverEngine = engine.getServerEngine();
    const questerId = engine
      .getCardInstanceIdsInZone("play", PLAYER_ONE)
      .find((id) => engine.getCardDefinitionId(id) === questingChar.id)!;

    serverEngine.engine.executeMove("manualReadyCard", { args: { cardId: questerId } });

    const result = engine.asLorcanaPlayerOne().quest(questingChar);
    expect(result.success).toBe(true);

    expect(serverEngine.isGameOver()).toBe(true);
    expect(serverEngine.getWinner()).toBe(PLAYER_ONE);
  });

  it("does not end the game at 19 lore", () => {
    const questingChar = createMockCharacter({
      id: "gsc-questing-char-2",
      name: "Questing Character 2",
      cost: 2,
      strength: 1,
      willpower: 3,
      lore: 1,
    });

    engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [questingChar], lore: 18 },
      { deck: 1 },
    );

    const serverEngine = engine.getServerEngine();
    const questerId = engine
      .getCardInstanceIdsInZone("play", PLAYER_ONE)
      .find((id) => engine.getCardDefinitionId(id) === questingChar.id)!;

    serverEngine.engine.executeMove("manualReadyCard", { args: { cardId: questerId } });

    const result = engine.asLorcanaPlayerOne().quest(questingChar);
    expect(result.success).toBe(true);

    expect(serverEngine.isGameOver()).toBe(false);
    expect(engine.getLore(PLAYER_ONE)).toBe(19);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// §1.8.1.2 integration — deck-empty loss ends the game
// ─────────────────────────────────────────────────────────────────────────────

describe("Deck-empty loss condition integration (§1.8.1.2)", () => {
  let engine: LorcanaMultiplayerTestEngine;

  afterEach(() => {
    engine?.dispose();
  });

  it("ends the game with an opponent win when active player passes with empty deck", () => {
    engine = LorcanaMultiplayerTestEngine.createWithFixture({ deck: 0 }, { deck: 1 });

    const result = engine.asLorcanaPlayerOne().passTurn();
    expect(result.success).toBe(true);

    expect(engine.asServer().isGameOver()).toBe(true);
    expect(engine.asServer().getWinner()).toBe(PLAYER_TWO);
  });

  it("does not trigger a loss when active player has at least one card in deck", () => {
    engine = LorcanaMultiplayerTestEngine.createWithFixture({ deck: 1 }, { deck: 1 });

    const result = engine.asLorcanaPlayerOne().passTurn();
    expect(result.success).toBe(true);

    expect(engine.asServer().isGameOver()).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Effective Willpower bug regression — §1.8.1.4 + static modifiers
// ─────────────────────────────────────────────────────────────────────────────

describe("Effective Willpower check in lethal banishment (§1.8.1.4 + static modifiers)", () => {
  let engine: LorcanaMultiplayerTestEngine;

  afterEach(() => {
    engine?.dispose();
  });

  it("does not banish a character whose effective Willpower (with +W aura) exceeds its damage", () => {
    // The aura grants +2 Willpower to your characters.
    // fragileTank has printed Willpower 2 but effective Willpower 4 (from aura).
    // Dealing 2 damage should NOT banish it.
    const fragileTank = createMockCharacter({
      id: "gsc-fragile-tank",
      name: "Fragile Tank",
      cost: 2,
      strength: 1,
      willpower: 2,
    });

    const aura = createMockCharacter({
      id: "gsc-willpower-aura",
      name: "Willpower Aura",
      cost: 3,
      strength: 1,
      willpower: 4,
      abilities: [
        {
          id: "gsc-willpower-aura-ability",
          text: "Your other characters get +2 {W}.",
          type: "static",
          effect: {
            type: "modify-stat",
            stat: "willpower",
            modifier: 2,
            target: "YOUR_OTHER_CHARACTERS",
          },
        },
      ],
    });

    const damageDealer = createMockCharacter({
      id: "gsc-dealer-2-dmg",
      name: "Damage Dealer",
      cost: 3,
      strength: 2,
      willpower: 3,
    });

    engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [damageDealer] },
      { play: [fragileTank, aura] },
    );

    const serverEngine = engine.getServerEngine();
    const attackerId = engine
      .getCardInstanceIdsInZone("play", PLAYER_ONE)
      .find((id) => engine.getCardDefinitionId(id) === damageDealer.id)!;
    const tankId = engine
      .getCardInstanceIdsInZone("play", PLAYER_TWO)
      .find((id) => engine.getCardDefinitionId(id) === fragileTank.id)!;

    // Exert attacker and defender for challenge.
    serverEngine.engine.executeMove("manualReadyCard", { args: { cardId: attackerId } });
    serverEngine.engine.executeMove("manualExertCard", { args: { cardId: tankId } });

    // Challenge: attacker has 2 strength, fragileTank takes 2 damage.
    // Effective Willpower = 2 (printed) + 2 (aura) = 4 → should NOT be banished.
    const result = serverEngine.engine.executeMove("challenge", {
      args: { attackerId, defenderId: tankId },
    });
    expect(result.success).toBe(true);

    expect(serverEngine.getCardZone(tankId)).toBe("play");
    expect(serverEngine.getDamage(tankId)).toBe(2);
  });
});
