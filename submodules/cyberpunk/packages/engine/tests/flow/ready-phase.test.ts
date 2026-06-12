import { describe, expect, it } from "vite-plus/test";
import {
  alphaArmoredMinotaur,
  alphaRuthlessLowlife,
  alphaSecondhandBombus,
  alphaTBugAmateurPhilosopher,
  alphaFloorIt,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine } from "../../src/testing/index.ts";
import { DIE_MAX_VALUES, type DieType } from "../../src/types/gig-die.ts";

/**
 * Ready Phase — the start-of-turn sequence (pass-phase.ts `endTurn`).
 *
 * At the start of your turn, complete each step in order:
 *   1. Ready spent cards
 *   2. Draw a card
 *   3. Gain a gig
 */

function completeTurn(engine: CyberpunkTestEngine) {
  const active = engine.getActivePlayerId();
  engine.passPhase({ as: active });
}

describe("Start Phase", () => {
  // ── Step 1: Ready Spent Cards ────────────────────────────────────

  describe("Ready Spent Cards", () => {
    it("readies all spent cards on the field", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [
            { card: alphaArmoredMinotaur, spent: true },
            { card: alphaRuthlessLowlife, spent: true },
          ],
        },
        {
          field: [
            { card: alphaSecondhandBombus, spent: true },
            { card: alphaTBugAmateurPhilosopher, spent: true },
          ],
        },
      );

      const active = engine.getActivePlayerId();
      const opponent = engine.getOpponentOf(active);

      // Verify opponent's field cards are spent before turn end
      const fieldBefore = engine.getCardsInZone("field", opponent);
      expect(fieldBefore.every((c) => c.meta.spent)).toBe(true);

      completeTurn(engine);

      // Opponent's field cards should now be ready
      const fieldAfter = engine.getCardsInZone("field", opponent);
      expect(fieldAfter.every((c) => !c.meta.spent)).toBe(true);
    });

    it("readies spent legends in legend area", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {},
        {},
        { skipSetup: false, seed: "ready-legends" },
      );

      // Transition from setup to play
      engine.passPhase({ as: engine.getActivePlayerId() });

      const firstPlayer = engine.getActivePlayerId();

      // First player starts with 2 spent legends
      expect(engine.getSpentLegends(firstPlayer)).toHaveLength(2);

      // First player completes their turn
      completeTurn(engine);
      // Second player completes their turn → first player's turn starts
      completeTurn(engine);

      // First player's spent legends should now be readied
      expect(engine.getSpentLegends(firstPlayer)).toHaveLength(0);
    });

    it("does not affect cards already in ready state", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [alphaArmoredMinotaur, { card: alphaRuthlessLowlife, spent: true }],
        },
        {
          field: [alphaSecondhandBombus, { card: alphaTBugAmateurPhilosopher, spent: true }],
        },
      );

      const active = engine.getActivePlayerId();
      const opponent = engine.getOpponentOf(active);

      completeTurn(engine);

      // All opponent's field cards should be ready
      const field = engine.getCardsInZone("field", opponent);
      expect(field.every((c) => !c.meta.spent)).toBe(true);
    });

    it("emits cardReadied events for each spent card", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [
            { card: alphaArmoredMinotaur, spent: true },
            { card: alphaRuthlessLowlife, spent: true },
          ],
        },
        {
          field: [
            { card: alphaSecondhandBombus, spent: true },
            { card: alphaTBugAmateurPhilosopher, spent: true },
          ],
        },
      );

      const active = engine.getActivePlayerId();
      const opponent = engine.getOpponentOf(active);
      const spentCount = engine
        .getCardsInZone("field", opponent)
        .filter((c) => c.meta.spent).length;

      completeTurn(engine);

      const readiedEvents = engine
        .getEvents("cardReadied")
        .filter((e) => "playerId" in e && e.playerId === opponent);
      expect(readiedEvents).toHaveLength(spentCount);
    });
  });

  // ── Step 2: Draw a Card ──────────────────────────────────────────

  describe("Draw a Card", () => {
    it("draws 1 card from deck to hand at the start of the turn", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {});
      const active = engine.getActivePlayerId();
      const opponent = engine.getOpponentOf(active);

      const handBefore = engine.getCardsInZone("hand", opponent).length;
      const deckBefore = engine.getCardsInZone("deck", opponent).length;

      completeTurn(engine);

      expect(engine.getCardsInZone("hand", opponent)).toHaveLength(handBefore + 1);
      expect(engine.getCardsInZone("deck", opponent)).toHaveLength(deckBefore - 1);
    });

    it("drawn card is the top card of the deck", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {});
      const active = engine.getActivePlayerId();
      const opponent = engine.getOpponentOf(active);

      const topOfDeck = engine.getCardsInZone("deck", opponent)[0]!;
      const handIdsBefore = new Set(
        engine.getCardsInZone("hand", opponent).map((c) => c.instanceId as string),
      );

      completeTurn(engine);

      const handAfter = engine.getCardsInZone("hand", opponent);
      const newCard = handAfter.find((c) => !handIdsBefore.has(c.instanceId as string));
      expect(newCard).toBeDefined();
      expect(newCard!.instanceId).toBe(topOfDeck.instanceId);
    });

    it("emits cardsDrawn event for the incoming player", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {});
      const active = engine.getActivePlayerId();
      const opponent = engine.getOpponentOf(active);

      completeTurn(engine);

      const drawEvents = engine.getEvents("cardsDrawn");
      const opponentDraw = drawEvents.find((e) => "playerId" in e && e.playerId === opponent);
      expect(opponentDraw).toBeDefined();
    });

    it("has no maximum hand size", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {});
      const active = engine.getActivePlayerId();
      const opponent = engine.getOpponentOf(active);
      const initialHandSize = engine.getCardsInZone("hand", opponent).length;

      // First turn: opponent draws
      completeTurn(engine);
      expect(engine.getCardsInZone("hand", opponent)).toHaveLength(initialHandSize + 1);

      // Opponent's turn passes without playing cards
      completeTurn(engine);

      // Back to original active's turn ending, opponent draws again
      completeTurn(engine);
      expect(engine.getCardsInZone("hand", opponent)).toHaveLength(initialHandSize + 2);
    });
  });

  // ── Step 3: Gain a Gig ──────────────────────────────────────────

  describe("Gain a Gig", () => {
    it("takes 1 die from fixer area and places it in gig area", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {});
      const active = engine.getActivePlayerId();
      const opponent = engine.getOpponentOf(active);

      expect(engine.getFixerDice(opponent)).toHaveLength(6);
      expect(engine.getGigCount(opponent)).toBe(0);

      completeTurn(engine);

      expect(engine.getFixerDice(opponent)).toHaveLength(5);
      expect(engine.getGigCount(opponent)).toBe(1);
    });

    it("die is rolled to a valid face value", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {});
      const active = engine.getActivePlayerId();
      const opponent = engine.getOpponentOf(active);

      completeTurn(engine);

      const gigDice = engine.getGigDice(opponent);
      expect(gigDice).toHaveLength(1);

      const die = gigDice[0]!;
      expect(die.faceValue).toBeGreaterThanOrEqual(1);
      expect(die.faceValue).toBeLessThanOrEqual(DIE_MAX_VALUES[die.dieType as DieType]);
      expect(die.location).toBe("gigArea");
    });

    it("advances the persisted seeded RNG state when a die is rolled", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {}, { seed: "gain-gig-rng-state" });
      const rngStateBefore = engine.getState().ctx.rngState?.state;

      completeTurn(engine);

      expect(engine.getEvents("gigDieRolled")).toHaveLength(1);
      expect(engine.getState().ctx.rngState?.state).not.toBe(rngStateBefore);
    });

    it("emits gigDieRolled and gigDieMoved events", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {});

      completeTurn(engine);

      expect(engine.getEvents("gigDieRolled").length).toBeGreaterThan(0);
      expect(engine.getEvents("gigDieMoved").length).toBeGreaterThan(0);
    });

    it("takes a non-d20 die before the d20", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {});
      const active = engine.getActivePlayerId();
      const opponent = engine.getOpponentOf(active);

      completeTurn(engine);

      const firstGig = engine.getGigDice(opponent)[0]!;
      expect(firstGig.dieType).not.toBe("d20");

      // d20 should still be in the fixer area
      const d20InFixer = engine.getFixerDice(opponent).find((d) => d.dieType === "d20");
      expect(d20InFixer).toBeDefined();
    });

    it("takes d20 when it is the last die remaining", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {}, { seed: "d20-last" });
      const active = engine.getActivePlayerId();
      const opponent = engine.getOpponentOf(active);

      // Cycle through 10 turns so each player takes 5 non-d20 dice
      for (let i = 0; i < 10; i++) {
        completeTurn(engine);
      }

      // Each player has taken 5 dice, only d20 remains in each fixer
      expect(engine.getFixerDice(opponent)).toHaveLength(1);
      expect(engine.getFixerDice(opponent)[0]!.dieType).toBe("d20");

      // One more turn: opponent gains the d20, now at 6 total.
      completeTurn(engine);

      expect(engine.getGigCount(opponent)).toBe(6);
      const d20Gig = engine.getGigDice(opponent).find((d) => d.dieType === "d20");
      expect(d20Gig).toBeDefined();
      expect(engine.isGameOver()).toBe(false);
    });
  });

  // ── Step 1: Ready Spent Cards (moved above) ─────────────────────

  // ── Step 2: Draw a Card ──────────────────────────────────────────

  describe("Draw a Card", () => {
    it("draws 1 card from deck to hand at the start of the turn", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {});
      const active = engine.getActivePlayerId();
      const opponent = engine.getOpponentOf(active);

      const handBefore = engine.getCardsInZone("hand", opponent).length;
      const deckBefore = engine.getCardsInZone("deck", opponent).length;

      completeTurn(engine);

      expect(engine.getCardsInZone("hand", opponent)).toHaveLength(handBefore + 1);
      expect(engine.getCardsInZone("deck", opponent)).toHaveLength(deckBefore - 1);
    });

    it("drawn card is the top card of the deck", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {});
      const active = engine.getActivePlayerId();
      const opponent = engine.getOpponentOf(active);

      const topOfDeck = engine.getCardsInZone("deck", opponent)[0]!;
      const handIdsBefore = new Set(
        engine.getCardsInZone("hand", opponent).map((c) => c.instanceId as string),
      );

      completeTurn(engine);

      const handAfter = engine.getCardsInZone("hand", opponent);
      const newCard = handAfter.find((c) => !handIdsBefore.has(c.instanceId as string));
      expect(newCard).toBeDefined();
      expect(newCard!.instanceId).toBe(topOfDeck.instanceId);
    });

    it("emits cardsDrawn event for the incoming player", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {});
      const active = engine.getActivePlayerId();
      const opponent = engine.getOpponentOf(active);

      completeTurn(engine);

      const drawEvents = engine.getEvents("cardsDrawn");
      const opponentDraw = drawEvents.find((e) => "playerId" in e && e.playerId === opponent);
      expect(opponentDraw).toBeDefined();
    });

    it("has no maximum hand size", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {});
      const active = engine.getActivePlayerId();
      const opponent = engine.getOpponentOf(active);
      const initialHandSize = engine.getCardsInZone("hand", opponent).length;

      // First turn: opponent draws
      completeTurn(engine);
      expect(engine.getCardsInZone("hand", opponent)).toHaveLength(initialHandSize + 1);

      // Opponent's turn passes without playing cards
      completeTurn(engine);

      // Back to original active's turn ending, opponent draws again
      completeTurn(engine);
      expect(engine.getCardsInZone("hand", opponent)).toHaveLength(initialHandSize + 2);
    });
  });

  // ── Step 3: Gain a Gig ──────────────────────────────────────────

  describe("Gain a Gig", () => {
    it("takes 1 die from fixer area and places it in gig area", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {});
      const active = engine.getActivePlayerId();
      const opponent = engine.getOpponentOf(active);

      expect(engine.getFixerDice(opponent)).toHaveLength(6);
      expect(engine.getGigCount(opponent)).toBe(0);

      completeTurn(engine);

      expect(engine.getFixerDice(opponent)).toHaveLength(5);
      expect(engine.getGigCount(opponent)).toBe(1);
    });

    it("die is rolled to a valid face value", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {});
      const active = engine.getActivePlayerId();
      const opponent = engine.getOpponentOf(active);

      completeTurn(engine);

      const gigDice = engine.getGigDice(opponent);
      expect(gigDice).toHaveLength(1);

      const die = gigDice[0]!;
      expect(die.faceValue).toBeGreaterThanOrEqual(1);
      expect(die.faceValue).toBeLessThanOrEqual(DIE_MAX_VALUES[die.dieType as DieType]);
      expect(die.location).toBe("gigArea");
    });

    it("advances the persisted seeded RNG state when a die is rolled", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {}, { seed: "gain-gig-rng-state" });
      const rngStateBefore = engine.getState().ctx.rngState?.state;

      completeTurn(engine);

      expect(engine.getEvents("gigDieRolled")).toHaveLength(1);
      expect(engine.getState().ctx.rngState?.state).not.toBe(rngStateBefore);
    });

    it("emits gigDieRolled and gigDieMoved events", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {});

      completeTurn(engine);

      expect(engine.getEvents("gigDieRolled").length).toBeGreaterThan(0);
      expect(engine.getEvents("gigDieMoved").length).toBeGreaterThan(0);
    });

    it("takes a non-d20 die before the d20", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {});
      const active = engine.getActivePlayerId();
      const opponent = engine.getOpponentOf(active);

      completeTurn(engine);

      const firstGig = engine.getGigDice(opponent)[0]!;
      expect(firstGig.dieType).not.toBe("d20");

      // d20 should still be in the fixer area
      const d20InFixer = engine.getFixerDice(opponent).find((d) => d.dieType === "d20");
      expect(d20InFixer).toBeDefined();
    });

    it("takes d20 when it is the last die remaining", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {}, { seed: "d20-last" });
      const active = engine.getActivePlayerId();
      const opponent = engine.getOpponentOf(active);

      // Cycle through 10 turns so each player takes 5 non-d20 dice
      for (let i = 0; i < 10; i++) {
        completeTurn(engine);
      }

      // Each player has taken 5 dice, only d20 remains in each fixer
      expect(engine.getFixerDice(opponent)).toHaveLength(1);
      expect(engine.getFixerDice(opponent)[0]!.dieType).toBe("d20");

      // One more turn: opponent gains the d20, now at 6 total.
      completeTurn(engine);

      expect(engine.getGigCount(opponent)).toBe(6);
      const d20Gig = engine.getGigDice(opponent).find((d) => d.dieType === "d20");
      expect(d20Gig).toBeDefined();
      expect(engine.isGameOver()).toBe(false);
    });
  });

  // ── Step 1: Ready Spent Cards (moved above) ─────────────────────

  // ── Turn Transition ──────────────────────────────────────────────

  describe("Turn Transition", () => {
    it("transitions to play phase for the new active player", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {});

      completeTurn(engine);

      expect(engine.getPhase()).toBe("main");
    });

    it("switches active player", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {});
      const firstActive = engine.getActivePlayerId();

      completeTurn(engine);

      expect(engine.getActivePlayerId()).not.toBe(firstActive);
    });

    it("increments turn number", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {});
      const turnBefore = engine.getTurnNumber();

      completeTurn(engine);

      expect(engine.getTurnNumber()).toBe(turnBefore + 1);
    });

    it("emits turnEnded before turnStarted", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {});

      completeTurn(engine);

      const allEvents = engine.getEvents();
      const turnEndedIdx = allEvents.findIndex((e) => e.type === "turnEnded");
      const turnStartedIdx = allEvents.findIndex((e) => e.type === "turnStarted");

      expect(turnEndedIdx).toBeGreaterThanOrEqual(0);
      expect(turnStartedIdx).toBeGreaterThanOrEqual(0);
      expect(turnEndedIdx).toBeLessThan(turnStartedIdx);
    });

    it("resets turn flags for the player whose turn ended", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [alphaFloorIt],
        eddies: 0,
      });

      const active = engine.getActivePlayerId();

      // Sell a card to set soldThisTurn = true
      engine.sellCard(alphaFloorIt, { as: active });
      expect(engine.getState().G.players[active as string]!.soldThisTurn).toBe(true);

      // Complete the turn (single pass from main ends it)
      engine.passPhase({ as: active });

      // soldThisTurn should be reset
      expect(engine.getState().G.players[active as string]!.soldThisTurn).toBe(false);
    });
  });
});
