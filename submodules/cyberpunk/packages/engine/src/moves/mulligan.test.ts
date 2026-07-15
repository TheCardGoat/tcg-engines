import { beforeAll, describe, expect, it } from "vite-plus/test";
import "../testing/matchers.d.ts";
import { CyberpunkTestEngine, P1, P2, createMockUnit, registerMatchers } from "../testing/index.ts";

beforeAll(() => {
  registerMatchers();
});

const moveIds = (engine: CyberpunkTestEngine, pid = P1) =>
  engine.getPrompt(pid).availableMoves.map((m) => m.moveId);

describe("mulligan", () => {
  describe("available()", () => {
    it("returns true during setup before mulliganing", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {}, { skipSetup: false });
      expect(moveIds(engine)).toContain("mulligan");
    });

    it("does not advertise legacy passPhase during setup", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {}, { skipSetup: false });
      expect(moveIds(engine)).not.toContain("passPhase");
    });

    it("returns false outside the setup phase", () => {
      const engine = CyberpunkTestEngine.createWithFixture({});
      expect(engine.getPhase()).toBe("main");
      expect(moveIds(engine)).not.toContain("mulligan");
    });

    it("returns false after the player has already mulliganed", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {}, { skipSetup: false });
      engine.mulligan({ as: P1 });
      expect(moveIds(engine)).not.toContain("mulligan");
    });
  });

  describe("validate()", () => {
    it("succeeds for a fresh player in the setup phase", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {}, { skipSetup: false });
      const result = engine.mulligan({ as: P1 });
      expect(result).toBeSuccessfulCommand();
    });

    it("fails with WRONG_PHASE outside the setup phase", () => {
      const engine = CyberpunkTestEngine.createWithFixture({});
      const failure = engine.expectFailure(() => engine.mulligan({ as: P1 }));
      expect(failure.errorCode).toBe("WRONG_PHASE");
    });

    it("fails with ALREADY_MULLIGANED on a second attempt", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {}, { skipSetup: false });
      engine.mulligan({ as: P1 });
      const failure = engine.expectFailure(() => engine.mulligan({ as: P1 }));
      expect(failure.errorCode).toBe("ALREADY_MULLIGANED");
    });
  });

  describe("execute()", () => {
    it("shuffles the hand into the deck and redraws six cards", () => {
      const handCards = [
        createMockUnit({ name: "A" }),
        createMockUnit({ name: "B" }),
        createMockUnit({ name: "C" }),
      ];
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: handCards, deck: 30 },
        {},
        { skipSetup: false },
      );

      expect(engine.getHandCount(P1)).toBe(3);
      engine.mulligan({ as: P1 });

      expect(engine.getHandCount(P1)).toBe(6);
      // `deck: 30` is the total deck size; 3 hand cards are pulled from those
      // 30 by the fixture. Mulligan reshuffles them in and draws 6, leaving
      // 30 − 6 = 24 in deck.
      const deck = engine.getCardsInZone("deck", P1);
      expect(deck).toHaveLength(24);
    });

    it("marks the player as mulliganDone for the mulliganing player only", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {}, { skipSetup: false });
      engine.mulligan({ as: P1 });

      expect(engine.isMulliganDone(P1)).toBe(true);
      expect(engine.isMulliganDone(P2)).toBe(false);
    });

    it("is deterministic for a given seed", () => {
      const fixture = () =>
        CyberpunkTestEngine.createWithFixture(
          { deck: 30 },
          {},
          {
            skipSetup: false,
            seed: "fixed-seed",
          },
        );

      const a = fixture();
      const b = fixture();
      a.mulligan({ as: P1 });
      b.mulligan({ as: P1 });

      const aIds = a.getCardsInZone("hand", P1).map((c) => c.definitionId);
      const bIds = b.getCardsInZone("hand", P1).map((c) => c.definitionId);
      expect(aIds).toEqual(bIds);
    });
  });
});
