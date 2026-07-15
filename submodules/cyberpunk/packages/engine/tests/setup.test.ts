import { describe, expect, it } from "vite-plus/test";
import { structuredCards } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../src/testing/index.ts";
import { defOf, getDefinitionFor, getInstance } from "../src/state/lookups.ts";
import { getDefinition } from "../src/state/card-registry.ts";

// The actual main deck size depends on available non-legend cards in the catalog
const MAIN_DECK_SIZE = Math.min(40, structuredCards.filter((c) => c.type !== "legend").length);
const STARTING_HAND_SIZE = 6;
const EXPECTED_DECK_AFTER_DRAW = MAIN_DECK_SIZE - STARTING_HAND_SIZE;

function createSetupEngine(seed = "test") {
  return CyberpunkTestEngine.createWithFixture({}, {}, { skipSetup: false, seed });
}

describe("Game Setup", () => {
  // ── Initial State ───────────────────────────────────────────────────

  describe("Initial State", () => {
    it("starts in setup phase", () => {
      const engine = createSetupEngine();
      expect(engine.getPhase()).toBe("setup");
    });

    it("game is not over", () => {
      const engine = createSetupEngine();
      expect(engine.isGameOver()).toBe(false);
      expect(engine.getWinnerId()).toBeNull();
    });

    it("mulliganDone is false for both players", () => {
      const engine = createSetupEngine();
      expect(engine.isMulliganDone(P1)).toBe(false);
      expect(engine.isMulliganDone(P2)).toBe(false);
    });
  });

  // ── Rule 1: Shuffle & Place ─────────────────────────────────────────

  describe("Shuffle & Place", () => {
    describe("Legends in Legend Area", () => {
      it("each player has exactly 3 legends in legendArea", () => {
        const engine = createSetupEngine();
        expect(engine.getCardsInZone("legendArea", P1)).toHaveLength(3);
        expect(engine.getCardsInZone("legendArea", P2)).toHaveLength(3);
      });

      it("all legends start face-down", () => {
        const engine = createSetupEngine();
        for (const pid of [P1, P2]) {
          expect(engine.getFaceDownLegends(pid)).toHaveLength(3);
        }
      });

      it("all cards in legendArea are legend type", () => {
        const engine = createSetupEngine();
        for (const pid of [P1, P2]) {
          for (const card of engine.getCardsInZone("legendArea", pid)) {
            expect(defOf(card).type).toBe("legend");
          }
        }
      });

      it("legend order is randomized across different seeds", () => {
        const engineA = createSetupEngine("legend-order-a");
        const engineB = createSetupEngine("legend-order-0");

        const orderA = engineA.getCardsInZone("legendArea", P1).map((c) => c.definitionId);
        const orderB = engineB.getCardsInZone("legendArea", P1).map((c) => c.definitionId);

        // Same legends, but order should differ with different seeds
        expect(orderA.slice().sort()).toEqual(orderB.slice().sort());
        expect(orderA).not.toEqual(orderB);
      });
    });

    describe("Main Deck", () => {
      it("each player has the expected cards in deck after drawing", () => {
        const engine = createSetupEngine();
        expect(engine.getCardsInZone("deck", P1)).toHaveLength(EXPECTED_DECK_AFTER_DRAW);
        expect(engine.getCardsInZone("deck", P2)).toHaveLength(EXPECTED_DECK_AFTER_DRAW);
      });

      it("deck contains no legend-type cards", () => {
        const engine = createSetupEngine();
        for (const pid of [P1, P2]) {
          for (const card of engine.getCardsInZone("deck", pid)) {
            expect(defOf(card).type).not.toBe("legend");
          }
        }
      });

      it("deck order is randomized across different seeds", () => {
        const engineA = createSetupEngine("deck-order-a");
        const engineB = createSetupEngine("deck-order-b");

        const first5A = engineA
          .getCardsInZone("deck", P1)
          .slice(0, 5)
          .map((c) => c.definitionId);
        const first5B = engineB
          .getCardsInZone("deck", P1)
          .slice(0, 5)
          .map((c) => c.definitionId);

        expect(first5A).not.toEqual(first5B);
      });
    });

    describe("Gig Dice in Fixer Area", () => {
      it("each player has exactly 6 dice in fixer area", () => {
        const engine = createSetupEngine();
        expect(engine.getFixerDice(P1)).toHaveLength(6);
        expect(engine.getFixerDice(P2)).toHaveLength(6);
      });

      it("dice are the standard set: d4, d6, d8, d10, d12, d20", () => {
        const engine = createSetupEngine();
        const dieTypes = engine
          .getFixerDice(P1)
          .map((d) => d.dieType)
          .sort();
        expect(dieTypes).toEqual(["d10", "d12", "d20", "d4", "d6", "d8"]);
      });

      it("all dice have faceValue 0 (unrolled)", () => {
        const engine = createSetupEngine();
        for (const die of engine.getFixerDice(P1)) {
          expect(die.faceValue).toBe(0);
        }
      });

      it("all dice have location fixerArea", () => {
        const engine = createSetupEngine();
        for (const die of engine.getFixerDice(P1)) {
          expect(die.location).toBe("fixerArea");
        }
      });

      it("gig area starts empty for both players", () => {
        const engine = createSetupEngine();
        expect(engine.getGigDice(P1)).toHaveLength(0);
        expect(engine.getGigCount(P1)).toBe(0);
        expect(engine.getGigDice(P2)).toHaveLength(0);
        expect(engine.getGigCount(P2)).toBe(0);
      });
    });
  });

  // ── Rule 2: Choose Play Order ───────────────────────────────────────

  describe("Play Order", () => {
    it("exactly one player is marked as first player", () => {
      const engine = createSetupEngine();
      expect(engine.isFirstPlayer(P1)).not.toBe(engine.isFirstPlayer(P2));
    });

    it("active player is the first player", () => {
      const engine = createSetupEngine();
      expect(engine.isFirstPlayer(engine.getActivePlayerId())).toBe(true);
    });

    it("first player has exactly 2 spent legends", () => {
      const engine = createSetupEngine();
      const firstPlayerId = engine.getActivePlayerId();
      expect(engine.getSpentLegends(firstPlayerId)).toHaveLength(2);
    });

    it("second player has zero spent legends", () => {
      const engine = createSetupEngine();
      const secondPlayerId = engine.getOpponentOf(engine.getActivePlayerId());
      expect(engine.getSpentLegends(secondPlayerId)).toHaveLength(0);
    });

    it("different seeds can produce different first players", () => {
      const seeds = ["fp-1", "fp-2", "fp-3", "fp-4", "fp-5", "fp-6", "fp-7", "fp-8"];
      const firstPlayers = new Set(
        seeds.map((s) => createSetupEngine(s).getActivePlayerId() as string),
      );
      expect(firstPlayers.size).toBeGreaterThan(1);
    });
  });

  // ── Rule 3: Draw Starting Hand ──────────────────────────────────────

  describe("Starting Hand", () => {
    it("each player has exactly 6 cards in hand", () => {
      const engine = createSetupEngine();
      expect(engine.getCardsInZone("hand", P1)).toHaveLength(6);
      expect(engine.getCardsInZone("hand", P2)).toHaveLength(6);
    });

    it("hand cards are not legend type", () => {
      const engine = createSetupEngine();
      for (const pid of [P1, P2]) {
        for (const card of engine.getCardsInZone("hand", pid)) {
          expect(defOf(card).type).not.toBe("legend");
        }
      }
    });

    it("deck + hand equals total main deck size", () => {
      const engine = createSetupEngine();
      for (const pid of [P1, P2]) {
        const deckSize = engine.getCardsInZone("deck", pid).length;
        const handSize = engine.getCardsInZone("hand", pid).length;
        expect(deckSize + handSize).toBe(MAIN_DECK_SIZE);
      }
    });
  });

  // ── Rule 4: Mulligan ────────────────────────────────────────────────

  describe("Mulligan", () => {
    describe("Successful Mulligan", () => {
      it("mulligan succeeds during setup phase", () => {
        const engine = createSetupEngine();
        engine.mulligan({ as: P1 });
      });

      it("still has 6 cards in hand after mulligan", () => {
        const engine = createSetupEngine();
        engine.mulligan({ as: P1 });
        expect(engine.getCardsInZone("hand", P1)).toHaveLength(6);
      });

      it("deck size is preserved after mulligan", () => {
        const engine = createSetupEngine();
        engine.mulligan({ as: P1 });
        expect(engine.getCardsInZone("deck", P1)).toHaveLength(EXPECTED_DECK_AFTER_DRAW);
      });

      it("produces a different hand than before", () => {
        const engine = createSetupEngine("mulligan-diff");
        const handBefore = engine.getCardsInZone("hand", P1).map((c) => c.definitionId);
        engine.mulligan({ as: P1 });
        const handAfter = engine.getCardsInZone("hand", P1).map((c) => c.definitionId);
        expect(handAfter).not.toEqual(handBefore);
      });

      it("sets mulliganDone to true", () => {
        const engine = createSetupEngine();
        engine.mulligan({ as: P1 });
        expect(engine.isMulliganDone(P1)).toBe(true);
      });

      it("remains in setup phase after mulligan", () => {
        const engine = createSetupEngine();
        engine.mulligan({ as: P1 });
        expect(engine.getPhase()).toBe("setup");
      });
    });

    describe("Restrictions", () => {
      it("cannot mulligan twice", () => {
        const engine = createSetupEngine();
        engine.mulligan({ as: P1 });

        const failure = engine.expectFailure(() => engine.mulligan({ as: P1 }));
        expect(failure.errorCode).toBe("ALREADY_MULLIGANED");
      });

      it("both players can mulligan independently", () => {
        const engine = createSetupEngine();
        const first = engine.getActivePlayerId();
        const second = engine.getOpponentOf(first);

        engine.mulligan({ as: P1 });
        engine.mulligan({ as: P2 });

        expect(engine.isMulliganDone(P1)).toBe(true);
        expect(engine.isMulliganDone(P2)).toBe(true);
        // After both decide, auto-advance runs the first player's start phase
        // (draw 1). First player: 6 + 1 = 7. Second player: still 6.
        expect(engine.getCardsInZone("hand", first)).toHaveLength(7);
        expect(engine.getCardsInZone("hand", second)).toHaveLength(6);
      });

      it("mulligan is not available outside setup phase", () => {
        const engine = CyberpunkTestEngine.createWithFixture({});
        // Default skipSetup=true puts us in main phase
        expect(engine.getPhase()).toBe("main");

        const failure = engine.expectFailure(() => engine.mulligan({ as: P1 }));
        expect(failure.errorCode).toBe("WRONG_PHASE");
      });
    });
  });

  // ── Setup Phase Transition ──────────────────────────────────────────

  describe("Setup Phase Transition", () => {
    it("auto-advances to play once both players have decided", () => {
      const engine = createSetupEngine();
      engine.keepHand({ as: P1 });
      expect(engine.getPhase()).toBe("setup");
      engine.keepHand({ as: P2 });
      expect(engine.getPhase()).toBe("main");
    });

    it("auto-advances after both mulligan", () => {
      const engine = createSetupEngine();
      engine.mulligan({ as: P1 });
      engine.mulligan({ as: P2 });
      expect(engine.getPhase()).toBe("main");
    });

    it("mulligan is unavailable after transitioning to play", () => {
      const engine = createSetupEngine();
      engine.keepHand({ as: P1 });
      engine.keepHand({ as: P2 });
      expect(engine.getPhase()).toBe("main");

      engine.expectFailure(() => engine.mulligan({ as: P1 }));
    });

    it("staying in setup until BOTH players have decided", () => {
      const engine = createSetupEngine();
      engine.keepHand({ as: P1 });
      expect(engine.getPhase()).toBe("setup");
      expect(engine.isMulliganDone(P1)).toBe(true);
      expect(engine.isMulliganDone(P2)).toBe(false);
    });
  });

  // ── Full Flow Integration ───────────────────────────────────────────

  describe("Full Flow Integration", () => {
    it("both players mulligan then auto-transition to play", () => {
      const engine = createSetupEngine("full-flow-both");
      const first = engine.getActivePlayerId();
      const second = engine.getOpponentOf(first);

      engine.mulligan({ as: P1 });
      engine.mulligan({ as: P2 });

      expect(engine.getPhase()).toBe("main");
      expect(engine.isMulliganDone(P1)).toBe(true);
      expect(engine.isMulliganDone(P2)).toBe(true);
      // First player ran start phase steps 2+3: drew 1, took a die.
      expect(engine.getCardsInZone("hand", first)).toHaveLength(7);
      expect(engine.getCardsInZone("hand", second)).toHaveLength(6);
    });

    it("one player mulligans, other keeps, then transition", () => {
      const engine = createSetupEngine("full-flow-one");
      const first = engine.getActivePlayerId();
      const second = engine.getOpponentOf(first);

      engine.mulligan({ as: P1 });
      engine.keepHand({ as: P2 });

      expect(engine.getPhase()).toBe("main");
      expect(engine.isMulliganDone(P1)).toBe(true);
      expect(engine.isMulliganDone(P2)).toBe(true);
      expect(engine.getCardsInZone("hand", first)).toHaveLength(7);
      expect(engine.getCardsInZone("hand", second)).toHaveLength(6);
    });

    it("both players keep, direct transition to play", () => {
      const engine = createSetupEngine("full-flow-none");
      const first = engine.getActivePlayerId();
      const second = engine.getOpponentOf(first);

      engine.keepHand({ as: P1 });
      engine.keepHand({ as: P2 });

      expect(engine.getPhase()).toBe("main");
      expect(engine.isMulliganDone(P1)).toBe(true);
      expect(engine.isMulliganDone(P2)).toBe(true);
      expect(engine.getCardsInZone("hand", first)).toHaveLength(7);
      expect(engine.getCardsInZone("hand", second)).toHaveLength(6);
    });

    it("all zone counts are consistent after complete setup", () => {
      const engine = createSetupEngine("full-flow-zones");
      const first = engine.getActivePlayerId();
      const second = engine.getOpponentOf(first);

      engine.mulligan({ as: P1 });
      engine.mulligan({ as: P2 });

      // First player ran start phase steps 2+3 on auto-advance.
      expect(engine.getCardsInZone("legendArea", first)).toHaveLength(3);
      expect(engine.getCardsInZone("hand", first)).toHaveLength(7);
      expect(engine.getCardsInZone("deck", first)).toHaveLength(EXPECTED_DECK_AFTER_DRAW - 1);
      expect(engine.getCardsInZone("field", first)).toHaveLength(0);
      expect(engine.getCardsInZone("trash", first)).toHaveLength(0);
      expect(engine.getFixerDice(first)).toHaveLength(5);
      expect(engine.getGigCount(first)).toBe(1);
      expect(engine.getEddies(first)).toBe(0);

      // Second player untouched until their first turn begins.
      expect(engine.getCardsInZone("legendArea", second)).toHaveLength(3);
      expect(engine.getCardsInZone("hand", second)).toHaveLength(6);
      expect(engine.getCardsInZone("deck", second)).toHaveLength(EXPECTED_DECK_AFTER_DRAW);
      expect(engine.getCardsInZone("field", second)).toHaveLength(0);
      expect(engine.getCardsInZone("trash", second)).toHaveLength(0);
      expect(engine.getFixerDice(second)).toHaveLength(6);
      expect(engine.getGigCount(second)).toBe(0);
      expect(engine.getEddies(second)).toBe(0);

      expect(engine.isGameOver()).toBe(false);
    });
  });

  // ── Card definition registry ────────────────────────────────────────

  describe("Card definition registry", () => {
    it("supports lookup by instanceId and by definitionId; both paths agree", () => {
      const engine = createSetupEngine("registry-parity");
      const G = engine.getState().G;

      const handCardId = engine.getCardsInZone("hand", P1)[0]!.instanceId as unknown as string;
      const inst = getInstance(G, handCardId);
      expect(inst.definitionId).toBeTruthy();

      const defViaId = getDefinition(inst.definitionId);
      expect(defViaId.id).toBe(inst.definitionId);

      const defViaInstance = getDefinitionFor(G, handCardId);
      expect(defViaInstance).toBe(defViaId);
      expect(defOf(inst)).toBe(defViaId);
    });

    it("CardInstance no longer carries an embedded definition (state stays lean)", () => {
      const engine = createSetupEngine("registry-size");
      const state = engine.getState();
      const inst = Object.values(state.G.cardIndex)[0]!;
      expect((inst as unknown as Record<string, unknown>).definition).toBeUndefined();

      // Sanity check that the serialized state is far smaller than it would be
      // if every instance embedded its full ~3 KB definition payload. With ~80
      // instances on the board, the embedded form would be > 240 KB; the lean
      // form should be well under 100 KB.
      const serialized = JSON.stringify(state);
      expect(serialized.length).toBeLessThan(100_000);
    });
  });
});
