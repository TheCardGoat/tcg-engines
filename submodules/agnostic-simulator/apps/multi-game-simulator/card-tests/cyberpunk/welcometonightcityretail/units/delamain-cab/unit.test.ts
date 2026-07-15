import { describe, expect, it } from "vite-plus/test";
import { CyberpunkTestEngine, P1 } from "@cyberpunk-engine/testing/index.ts";
import { welcomeToNightCityRetailDelamainCab } from "@tcg/cyberpunk-cards";

// Delamain Cab: "At the end of your turn, if this Unit stole a Gig this turn,
// ready 1 Eddie." The delayed end-of-turn effect only fires when Delamain
// itself was the source of a steal this turn.
const delamain = welcomeToNightCityRetailDelamainCab; // unit, cost 4, power 4, Vehicle

describe("Delamain Cab", () => {
  describe("At the end of your turn, if this Unit stole a Gig this turn, ready 1 Eddie", () => {
    it("readies 1 Eddie at end of turn after stealing a Gig", () => {
      // 2 spent Eddies give the ready effect something to act on; the rival
      // holds a Gig Delamain can steal on a direct attack.
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: delamain, spent: false, hasLag: false }],
          eddies: 2,
          spentEddies: 2,
        },
        { gigArea: [{ dieType: "d6", faceValue: 3 }] },
      );
      const eddiesBefore = engine.getEddies(P1);
      const spentBefore = engine.getState().G.players[P1].spentEddies;

      engine.attackRival(delamain, { as: P1 });
      engine.resolveFullSteal({ as: P1 });
      // Stealing schedules the delayed end-of-turn ready effect.
      engine.completeTurn({ as: P1 });

      // The end-of-turn effect readied exactly 1 Eddie (spentEddies dropped by 1,
      // available Eddies rose by 1).
      expect(engine.getEddies(P1)).toBe(eddiesBefore + 1);
      expect(engine.getState().G.players[P1].spentEddies).toBe(spentBefore - 1);
    });

    it("does NOT ready an Eddie when it did not steal a Gig this turn", () => {
      // Same spent Eddies, but no rival Gig to steal → no steal this turn → the
      // conditional delayed effect never schedules.
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: delamain, spent: false, hasLag: false }],
        eddies: 2,
        spentEddies: 2,
      });
      const eddiesBefore = engine.getEddies(P1);
      const spentBefore = engine.getState().G.players[P1].spentEddies;

      // Pass the play phase straight into the turn end without attacking.
      engine.completeTurn({ as: P1 });

      // No steal happened → no Eddie readied.
      expect(engine.getEddies(P1)).toBe(eddiesBefore);
      expect(engine.getState().G.players[P1].spentEddies).toBe(spentBefore);
    });
  });
});
