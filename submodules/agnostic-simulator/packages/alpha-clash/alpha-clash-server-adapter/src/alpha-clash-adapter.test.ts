import { describe, expect, it } from "vitest";
import type { CardsMaps, DeckCard, DeckBuildInput } from "@tcg/shared/game-adapter";
import { allCards } from "@tcg/alpha-clash-cards";
import { createInitialState } from "@tcg/alpha-clash-engine";
import { EngineInteractionView } from "@tcg/protocol";
import {
  alphaClashCreateServerEngine,
  alphaClashRestoreEngine,
  alphaClashSerializeEngine,
} from "./alpha-clash-engine-lifecycle";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
import { alphaClashBotCommand, alphaClashBotCommandCandidates } from "./bot";
import { alphaClashServerAdapter } from "./adapter";

const P1 = "actor-human";
const P2 = "actor-bot";

function practiceDeck(id: string): DeckCard[] {
  const deck = alphaClashServerAdapter.practiceDecks?.getDeck(id);
  if (!deck) throw new Error(`Missing practice deck: ${id}`);
  return [...deck];
}

function cardsMapsFor(
  decks: ReadonlyArray<{ owner: string; deck: readonly DeckCard[] }>,
): CardsMaps {
  // DeckCard.quantity (deck documents) becomes DeckEntry.qty (build input).
  const inputs: DeckBuildInput[] = decks.map(({ owner, deck }) => ({
    owner,
    deck: deck.map((entry) => ({
      cardId: entry.cardId,
      qty: entry.quantity,
      ...(entry.sectionId ? { sectionId: entry.sectionId } : {}),
    })),
  }));
  return alphaClashServerAdapter.buildCardInstances(inputs);
}

/** Started practice engine with default decks under a deterministic seed. */
async function createPracticeEngine(seed: string): Promise<AlphaClashServerEngine> {
  const maps = cardsMapsFor([
    { owner: P1, deck: practiceDeck("starter-titan") },
    { owner: P2, deck: practiceDeck("starter-warden") },
  ]);
  const engine = await alphaClashCreateServerEngine({
    gameSlug: "alpha-clash",
    seed,
    player1Id: P1,
    player2Id: P2,
    cardsMaps: maps,
  });
  return engine as AlphaClashServerEngine;
}

describe("Alpha Clash deck validation", () => {
  it("accepts a generated practice deck", () => {
    const result = alphaClashServerAdapter.validateDeckForFormat(
      "constructed",
      practiceDeck("starter-titan"),
    );
    expect(result.valid).toBe(true);
  });

  it("rejects a 49-card main deck (rule 100.2a)", () => {
    const deck = practiceDeck("starter-titan").map((entry) => ({ ...entry }));
    const main = deck.find((entry) => entry.sectionId !== "contender");
    if (!main) throw new Error("No main-deck entry");
    main.quantity -= 1;
    const result = alphaClashServerAdapter.validateDeckForFormat("constructed", deck);
    expect(result.valid).toBe(false);
    expect(result.rules.find((rule) => rule.kind === "main-deck-size")?.passed).toBe(false);
  });

  /**
   * Rule 100.2a (Comprehensive Rulebook v8.0): Main Deck of 50-60 cards.
   * Grows a valid practice deck with fresh playsets of distinct vanilla
   * cards (no Clash Buffs, Unrivaled, or Rivaled) up to the target size.
   */
  function growDeckTo(base: DeckCard[], target: number): DeckCard[] {
    const deck = base.map((entry) => ({ ...entry }));
    const nameOf = new Map(allCards().map((card) => [card.id, card.name] as const));
    const usedNames = new Set(
      deck.map((entry) => nameOf.get(entry.cardId)).filter((name) => name !== undefined),
    );
    let total = deck
      .filter((entry) => entry.sectionId !== "contender")
      .reduce((sum, entry) => sum + entry.quantity, 0);
    for (const card of allCards()) {
      if (total >= target) break;
      if (
        card.cardType === "contender" ||
        usedNames.has(card.name) ||
        card.subtype === "clash-buff" ||
        card.keywords?.includes("unrivaled")
      ) {
        continue;
      }
      usedNames.add(card.name);
      const add = Math.min(4, target - total);
      deck.push({ cardId: card.id, sectionId: "main", quantity: add });
      total += add;
    }
    return deck;
  }

  it("accepts 55- and 60-card main decks (rule 100.2a, v8.0: 50-60)", () => {
    for (const size of [55, 60]) {
      const deck = growDeckTo(practiceDeck("starter-titan"), size);
      const result = alphaClashServerAdapter.validateDeckForFormat("constructed", deck);
      expect(result.valid, `size ${size}: ${JSON.stringify(result.rules)}`).toBe(true);
    }
  });

  it("rejects a 61-card main deck (rule 100.2a, v8.0 upper bound)", () => {
    const deck = growDeckTo(practiceDeck("starter-titan"), 61);
    const result = alphaClashServerAdapter.validateDeckForFormat("constructed", deck);
    expect(result.rules.find((rule) => rule.kind === "main-deck-size")?.passed).toBe(false);
  });

  it("rejects five copies of one card (rule 100.4a)", () => {
    const deck = practiceDeck("starter-titan").map((entry) => ({ ...entry }));
    const main = deck.find((entry) => entry.sectionId !== "contender");
    if (!main) throw new Error("No main-deck entry");
    main.quantity = 50;
    const result = alphaClashServerAdapter.validateDeckForFormat("constructed", deck);
    expect(result.valid).toBe(false);
    expect(result.rules.find((rule) => rule.kind === "copy-limit")?.passed).toBe(false);
  });

  it("rejects a deck without a Contender", () => {
    const deck = practiceDeck("starter-titan").filter((entry) => entry.sectionId === "main");
    const result = alphaClashServerAdapter.validateDeckForFormat("constructed", deck);
    expect(result.valid).toBe(false);
    expect(result.rules.find((rule) => rule.kind === "single-contender")?.passed).toBe(false);
  });
});

describe("Alpha Clash card summaries", () => {
  it("resolves official card ids to summaries", () => {
    const summary = alphaClashServerAdapter.getCardById("ac-ac1-003");
    expect(summary?.label).toBeTruthy();
    expect(Array.isArray(summary?.colors)).toBe(true);
    expect(alphaClashServerAdapter.getCardById("not-a-card")).toBeNull();
  });

  it("tags Contender instances with the contender section", () => {
    const maps = cardsMapsFor([{ owner: P1, deck: practiceDeck("starter-titan") }]);
    const contenderInstances = Object.entries(maps.instanceSections ?? {})
      .filter(([, section]) => section === "contender")
      .map(([instanceId]) => instanceId);
    expect(contenderInstances).toHaveLength(1);
    const contenderCardId = maps.cardInstances[contenderInstances[0]];
    expect(alphaClashServerAdapter.getCardById(contenderCardId)?.label).toContain("Titan");
  });
});

describe("Alpha Clash server engine lifecycle", () => {
  async function createEngine(): Promise<AlphaClashServerEngine> {
    const maps = cardsMapsFor([
      { owner: P1, deck: practiceDeck("starter-titan") },
      { owner: P2, deck: practiceDeck("starter-warden") },
    ]);
    const engine = await alphaClashCreateServerEngine({
      gameSlug: "alpha-clash",
      seed: "7",
      player1Id: P1,
      player2Id: P2,
      cardsMaps: maps,
    });
    return engine as AlphaClashServerEngine;
  }

  it("creates a setup-phase match with 8-card hands", async () => {
    const engine = await createEngine();
    expect(engine.state.phase.name).toBe("setup");
    const p1Hand = Object.values(engine.state.cards).filter(
      (card) => card.controller === "player-one" && card.zone === "hand",
    );
    expect(p1Hand).toHaveLength(8);
  });

  it("starts, passes turns through bot automation, and records a log", async () => {
    const engine = await createEngine();
    const context = {
      gameId: "test-game",
      sourceAuthority: "server" as const,
    };
    const started = engine.dispatch("startGame", P1, {}, context);
    expect(started.success).toBe(true);

    // Let the bot automation drive both sides through several steps.
    for (let step = 0; step < 40; step++) {
      if (engine.hasGameEnded()) break;
      const actorId = engine.getActivePlayerId();
      if (!actorId) {
        const advanced = engine.dispatch(
          "pass",
          engine.seatToPlayerId[engine.state.activePlayer],
          {},
          context,
        );
        if (!advanced.success) break;
        continue;
      }
      const bot = engine.takeAutomatedAction({ strategyId: "default" }, context);
      if (!bot.finalResult.success) break;
    }
    expect(engine.state.turnNumber).toBeGreaterThan(0);
    expect(engine.state.moveLog.length).toBeGreaterThan(0);
  });

  it("serializes and restores the engine round-trip", async () => {
    const engine = await createEngine();
    engine.dispatch("startGame", P1, {}, { gameId: "test-game", sourceAuthority: "server" });
    const snapshot = alphaClashSerializeEngine(engine, {
      cardInstances: {},
      owners: {},
    });
    expect(snapshot.gameSlug).toBe("alpha-clash");
    // Platform persistence derives the CAS version from the snapshot itself
    // (stateVersionFromSnapshot); a version-less snapshot rejects every move.
    const snapshotState = snapshot.state as { stateVersion?: unknown };
    expect(typeof snapshotState.stateVersion).toBe("number");
    expect(snapshotState.stateVersion).toBe(engine.getStateID());
    const restored = await alphaClashRestoreEngine(snapshot, {
      gameSlug: "alpha-clash",
      seed: "7",
      player1Id: P1,
      player2Id: P2,
    });
    expect(restored).toBeInstanceOf(AlphaClashServerEngine);
    expect(restored.getStateID()).toBe(engine.getStateID());
    expect((restored.getState() as { turnNumber: number }).turnNumber).toBe(
      engine.state.turnNumber,
    );
  });

  it("exposes an interaction view with setup actions and a concession", async () => {
    const engine = await createEngine();
    const view = engine.getInteractionView(P1);
    expect(view.gameSlug).toBe("alpha-clash");
    expect(view.actorId).toBe(P1);
    const ids = view.actions.map((action) => action.id);
    expect(ids).toContain("startGame");
    expect(ids).toContain("mulligan");
    expect(ids).toContain("concede");
  });

  it("drops the mulligan action once this seat has taken it (rule 103.5)", async () => {
    const engine = await createEngine();
    const before = engine.getInteractionView(P1);
    expect(before.actions.some((action) => action.id === "mulligan")).toBe(true);

    const taken = engine.dispatch(
      "mulligan",
      P1,
      {},
      {
        gameId: "test-game",
        sourceAuthority: "server" as const,
      },
    );
    expect(taken.success).toBe(true);

    const after = engine.getInteractionView(P1);
    expect(after.actions.some((action) => action.id === "mulligan")).toBe(false);
    expect(after.actions.some((action) => action.id === "startGame")).toBe(true);
  });

  it("advances the state version on every applied command, logged or not", async () => {
    const engine = await createEngine();
    const start = engine.getStateID();
    const mulligan = engine.dispatch(
      "mulligan",
      P1,
      {},
      {
        gameId: "test-game",
        sourceAuthority: "server" as const,
      },
    );
    expect(mulligan.success).toBe(true);
    const afterMulligan = engine.getStateID();
    expect(afterMulligan).toBeGreaterThan(start);

    const started = engine.dispatch(
      "startGame",
      P1,
      {},
      {
        gameId: "test-game",
        sourceAuthority: "server" as const,
      },
    );
    expect(started.success).toBe(true);
    const afterStart = engine.getStateID();
    // startGame may not append a log entry; the version must advance anyway
    // or platform persistence replays the previous version and drops the
    // committed state (F21).
    expect(afterStart).toBeGreaterThan(afterMulligan);
    expect(started.stateID).toBe(afterStart);
  });

  it("maps actor ids to engine seats in both directions", async () => {
    const engine = await createEngine();
    expect(engine.playerIdToSeat[P1]).toBe("player-one");
    expect(engine.playerIdToSeat[P2]).toBe("player-two");
    expect(engine.seatToPlayerId["player-one"]).toBe(P1);
    expect(engine.seatToPlayerId["player-two"]).toBe(P2);
  });
});

describe("Alpha Clash obstruct interaction view", () => {
  it("publishes a schema-valid obstruct view whose max fits the ready candidates (504.2c)", async () => {
    const engine = await createPracticeEngine("7");
    const context = { gameId: "test-game", sourceAuthority: "server" as const };
    const started = engine.dispatch("startGame", P1, {}, context);
    expect(started.success).toBe(true);

    // Automate both seats up to (but not through) the Obstruct Step.
    let reached = false;
    for (let step = 0; step < 200 && !engine.hasGameEnded(); step++) {
      const clash = engine.state.clash;
      if (engine.state.phase.name === "clash" && clash?.step === "obstruct") {
        reached = true;
        break;
      }
      const actorId = engine.getActivePlayerId();
      if (!actorId) {
        const advanced = engine.dispatch(
          "pass",
          engine.seatToPlayerId[engine.state.activePlayer],
          {},
          context,
        );
        if (!advanced.success) break;
        continue;
      }
      const bot = engine.takeAutomatedAction({ strategyId: "default" }, context);
      if (!bot.finalResult.success) break;
    }
    if (!reached) throw new Error("Automation never reached the Obstruct Step");

    const clash = engine.state.clash;
    if (!clash) throw new Error("No clash in progress at the Obstruct Step");
    const defenderSeat = engine.state.cards[clash.targetId]?.controller;
    if (defenderSeat !== "player-one" && defenderSeat !== "player-two") {
      throw new Error(`Unknown defender seat: ${String(defenderSeat)}`);
    }
    const view = engine.getInteractionView(engine.seatToPlayerId[defenderSeat]);

    // The whole view must parse against the protocol schema; a max above the
    // enabled candidate count used to fail safeParse and freeze the game.
    const parsed = EngineInteractionView.safeParse(view);
    if (!parsed.success) {
      throw new Error(
        `Obstruct view failed the protocol schema: ${JSON.stringify(parsed.error.issues)}`,
      );
    }
    expect(parsed.success).toBe(true);

    const action = view.actions.find((entry) => entry.id === "declareObstructors");
    if (!action) throw new Error("The obstruct view does not advertise declareObstructors");
    const input = action.inputs.find(
      (entry) => entry.kind === "entity-selection" && entry.id === "obstructorIds",
    );
    if (!input || input.kind !== "entity-selection") {
      throw new Error("declareObstructors is missing its obstructorIds entity selection");
    }
    expect(input.min).toBe(0);
    expect(input.max).toBe(input.candidates.length);
    expect(input.candidates.length).toBeLessThan(8);
  });
});

describe("Alpha Clash bot automation endurance", () => {
  it("keeps the seed-1 practice match automating past the historical turn-4 stall", async () => {
    const engine = await createPracticeEngine("1");
    const context = { gameId: "test-game", sourceAuthority: "server" as const };
    expect(engine.dispatch("startGame", P1, {}, context).success).toBe(true);

    let actions = 0;
    for (let step = 0; step < 80; step++) {
      if (engine.hasGameEnded()) break;
      const actorId = engine.getActivePlayerId();
      if (!actorId) {
        const advanced = engine.dispatch(
          "pass",
          engine.seatToPlayerId[engine.state.activePlayer],
          {},
          context,
        );
        expect(advanced.success).toBe(true);
        continue;
      }
      const bot = engine.takeAutomatedAction({ strategyId: "default" }, context);
      actions += 1;
      if (!bot.finalResult.success) {
        throw new Error(`Automation failed after ${actions} actions: ${bot.finalResult.error}`);
      }
    }
    expect(actions).toBeGreaterThanOrEqual(30);
    expect(engine.state.turnNumber).toBeGreaterThan(4);
  });
});

describe("Alpha Clash bot policy", () => {
  it("never selects an attached Weapon as attacker or obstructor", () => {
    const weapon = allCards().find(
      (card) => card.cardType === "accessory" && card.subtype === "weapon",
    );
    const clashCard = allCards().find((card) => card.cardType === "clash");
    if (!weapon || !clashCard) throw new Error("Catalog fixture cards are missing");

    const state = createInitialState({
      id: "bot-weapon-filter",
      seed: 1,
      validateDeck: false,
      players: {
        "player-one": {
          name: "P1",
          deck: { contenderId: "acx-contender-titan", deckIds: [weapon.id, clashCard.id] },
        },
        "player-two": {
          name: "P2",
          deck: { contenderId: "acx-contender-warden", deckIds: [] },
        },
      },
    });

    // Primary with an attached ready Weapon in the Clash Zone and no ready
    // Clash card: a clash must not be initiated (Weapons aren't Clash cards).
    state.phase = { name: "primary" };
    const weaponInstance = Object.values(state.cards).find(
      (card) => card.definitionId === weapon.id,
    );
    if (!weaponInstance) throw new Error("Weapon instance missing from the fixture state");
    weaponInstance.zone = "clash";
    weaponInstance.ready = true;

    expect(alphaClashBotCommand(state, "player-one")?.type).not.toBe("initiateClash");
    expect(
      alphaClashBotCommandCandidates(state, "player-one").some(
        (command) => command.type === "initiateClash",
      ),
    ).toBe(false);

    // With a real ready Clash card alongside it, that card is the attacker.
    const clashInstance = Object.values(state.cards).find(
      (card) => card.definitionId === clashCard.id,
    );
    if (!clashInstance) throw new Error("Clash card instance missing from the fixture state");
    clashInstance.zone = "clash";
    clashInstance.ready = true;
    const command = alphaClashBotCommand(state, "player-one");
    if (!command || command.type !== "initiateClash") {
      throw new Error("Expected the bot to initiate a clash with the ready Clash card");
    }
    expect(command.attackerId).toBe(clashInstance.instanceId);
    expect(command.attackerId).not.toBe(weaponInstance.instanceId);
  });
});
