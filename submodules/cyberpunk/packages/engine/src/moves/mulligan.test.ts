import { beforeAll, describe, expect, it } from "vite-plus/test";
import "../testing/matchers.d.ts";
import { CyberpunkTestEngine, P1, registerMatchers } from "../testing/index.ts";

beforeAll(() => {
  registerMatchers();
});

const moveIds = (engine: CyberpunkTestEngine, pid = engine.getActivePlayerId()) =>
  engine.getPrompt(pid).availableMoves.map((m) => m.moveId);

function openingSeats(engine: CyberpunkTestEngine) {
  const first = engine.getActivePlayerId();
  const second = engine.getOpponentOf(first);
  return { first, second };
}

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
      const { first } = openingSeats(engine);
      engine.mulligan({ as: first });
      expect(moveIds(engine, first)).not.toContain("mulligan");
    });

    it("is unavailable for the second player until the first player decides", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {}, { skipSetup: false });
      const { first, second } = openingSeats(engine);
      expect(moveIds(engine, second)).not.toContain("mulligan");
      expect(moveIds(engine, second)).not.toContain("keepHand");
      engine.keepHand({ as: first });
      expect(moveIds(engine, second)).toContain("mulligan");
      expect(moveIds(engine, second)).toContain("keepHand");
    });
  });

  describe("validate()", () => {
    it("succeeds for a fresh player in the setup phase", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {}, { skipSetup: false });
      const { first } = openingSeats(engine);
      const result = engine.mulligan({ as: first });
      expect(result).toBeSuccessfulCommand();
    });

    it("fails with WRONG_PHASE outside the setup phase", () => {
      const engine = CyberpunkTestEngine.createWithFixture({});
      const failure = engine.expectFailure(() => engine.mulligan({ as: P1 }));
      expect(failure.errorCode).toBe("WRONG_PHASE");
    });

    it("fails with ALREADY_MULLIGANED on a second attempt", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {}, { skipSetup: false });
      const { first } = openingSeats(engine);
      engine.mulligan({ as: first });
      const failure = engine.expectFailure(() => engine.mulligan({ as: first }));
      expect(failure.errorCode).toBe("ALREADY_MULLIGANED");
    });

    it("fails with NOT_YOUR_TURN if the second player acts first", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {}, { skipSetup: false });
      const { second } = openingSeats(engine);
      const failure = engine.expectFailure(() => engine.mulligan({ as: second }));
      expect(failure.errorCode).toBe("NOT_YOUR_TURN");
    });
  });

  describe("execute()", () => {
    it("shuffles the hand into the deck and redraws six cards", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { deck: 30 },
        { deck: 30 },
        { skipSetup: false },
      );
      const { first } = openingSeats(engine);

      expect(engine.getHandCount(first)).toBe(6);
      engine.mulligan({ as: first });

      expect(engine.getHandCount(first)).toBe(6);
      const deck = engine.getCardsInZone("deck", first);
      expect(deck).toHaveLength(24);
    });

    it("marks the player as mulliganDone for the mulliganing player only", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {}, { skipSetup: false });
      const { first, second } = openingSeats(engine);
      engine.mulligan({ as: first });

      expect(engine.isMulliganDone(first)).toBe(true);
      expect(engine.isMulliganDone(second)).toBe(false);
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
      const firstA = a.getActivePlayerId();
      const firstB = b.getActivePlayerId();
      a.mulligan({ as: firstA });
      b.mulligan({ as: firstB });

      const aIds = a.getCardsInZone("hand", firstA).map((c) => c.definitionId);
      const bIds = b.getCardsInZone("hand", firstB).map((c) => c.definitionId);
      expect(aIds).toEqual(bIds);
    });
  });
});
