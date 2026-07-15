import { describe, expect, it } from "vite-plus/test";
import { CyberpunkTestEngine, P1, expectNoPendingChoice } from "@cyberpunk-engine/testing/index.ts";
import {
  welcomeToNightCityRetail6thStreetRecruits,
  welcomeToNightCityRetailRidingNomad,
} from "@tcg/cyberpunk-cards";

// 6th Street Recruits: "When a friendly Unit steals a d6, increase a Gig by
// up to 6." The trigger fires only when the stolen die is a d6 — stealing a
// different die type does not.
const recruits = welcomeToNightCityRetail6thStreetRecruits; // unit, cost 4, power 6
// Riding Nomad has ADRENALINE, so it can attack the turn it is played — no
// need to wait a turn to produce a steal.
const attacker = welcomeToNightCityRetailRidingNomad; // unit, ADRENALINE, power 4

describe("6th Street Recruits", () => {
  describe("When a friendly Unit steals a d6, increase a Gig by up to 6", () => {
    it("increases a chosen friendly Gig after a friendly Unit steals a d6", () => {
      // Rival holds a d6. The friendly attacker steals it on a direct attack;
      // 6th Street Recruits' trigger then asks for a Gig to increase by up to 6.
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [
            { card: recruits, spent: false, hasLag: false },
            { card: attacker, spent: false, hasLag: false },
          ],
          gigArea: [{ dieType: "d4", faceValue: 1 }],
        },
        { gigArea: [{ dieType: "d6", faceValue: 2 }] },
      );

      engine.attackRival(attacker, { as: P1 });
      engine.resolveFullSteal({ as: P1 });

      // First the trigger offers a Gig to increase (effectTarget, gig kind).
      const gigChoice = engine.getState().G.turnMetadata.pendingChoice;
      expect(gigChoice?.type).toBe("chooseTarget");
      if (gigChoice?.type !== "chooseTarget") throw new Error("expected chooseTarget");
      expect(gigChoice.payload.type).toBe("effectTarget");
      expect(gigChoice.payload.targetKind).toBe("gig");
      // Pick the friendly d4, then its new face value.
      const dieId = engine.getGigDice(P1).find((d) => d.dieType === "d4")!.id;
      engine.resolveEffectTargetIds([dieId], {
        as: P1,
        allowPendingChoice: true,
        reason: "select the Gig, then choose its new value",
      });
      // d4 face value 1 -> 4 (an increase of up to 6).
      engine.resolveAdjustGig(4, { as: P1 });

      // Observable: the friendly d4 is now at value 4.
      expect(engine.getGigValue(P1, 0)).toBe(4);
      expectNoPendingChoice(engine);
    });

    it("does NOT fire when the stolen die is not a d6 (steal a d4 → no choice)", () => {
      // Rival holds a d4 only. The trigger's `sides: "d6"` filter excludes it.
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [
            { card: recruits, spent: false, hasLag: false },
            { card: attacker, spent: false, hasLag: false },
          ],
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        { gigArea: [{ dieType: "d4", faceValue: 2 }] },
      );
      engine.attackRival(attacker, { as: P1 });
      engine.resolveFullSteal({ as: P1 });
      // Stole a d4, not a d6 → trigger never fires.
      expectNoPendingChoice(engine);
    });

    it("increases by the full allowed amount (up to 6, clamped to the die's max)", () => {
      // A d6 can go to 6. Requesting +6 from value 1 lands at 6 (the structural max).
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [
            { card: recruits, spent: false, hasLag: false },
            { card: attacker, spent: false, hasLag: false },
          ],
          gigArea: [{ dieType: "d6", faceValue: 1 }],
        },
        { gigArea: [{ dieType: "d6", faceValue: 2 }] },
      );

      engine.attackRival(attacker, { as: P1 });
      engine.resolveFullSteal({ as: P1 });

      // There are two d6s now (the original + the stolen one). Pick the first.
      const dieId = engine.getGigDice(P1)[0]!.id;
      engine.resolveEffectTargetIds([dieId], {
        as: P1,
        allowPendingChoice: true,
        reason: "select the Gig, then choose its new value",
      });
      engine.resolveAdjustGig(6, { as: P1 });
      // At least one friendly Gig reached its structural max of 6.
      const values = engine.getGigDice(P1).map((d) => d.faceValue);
      expect(values).toContain(6);
    });
  });
});
