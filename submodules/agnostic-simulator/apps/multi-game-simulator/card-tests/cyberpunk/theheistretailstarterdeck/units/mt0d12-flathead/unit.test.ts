import { describe, expect, it } from "vite-plus/test";
import { CyberpunkTestEngine, P1, P2 } from "@cyberpunk-engine/testing/index.ts";
import {
  theHeistRetailStarterDeckMt0d12Flathead,
  welcomeToNightCityRetailCorpoSecurity,
} from "@tcg/cyberpunk-cards";

// MT0D12 Flathead: "If you have less ☆ (Street Cred) than a Rival, this Unit
// can't be blocked." The static `cantBeBlocked` rule toggles on the Street-Cred
// comparison, so a rival BLOCKER cannot redirect Flathead's direct attack while
// Flathead's controller trails in Street Cred.
const flathead = theHeistRetailStarterDeckMt0d12Flathead; // unit, cost 5, power 7
const rivalBlocker = welcomeToNightCityRetailCorpoSecurity; // BLOCKER, power 2

describe("MT0D12 Flathead", () => {
  describe("If you have less ☆ (Street Cred) than a Rival, this Unit can't be blocked", () => {
    it("a rival BLOCKER cannot redirect Flathead's direct attack when P1 has less Street Cred", () => {
      // P1 cred 1 (d4) < P2 cred 8 (d8) → cantBeBlocked is active.
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: flathead, spent: false, hasLag: false }],
          gigArea: [{ dieType: "d4", faceValue: 1 }],
        },
        {
          field: [{ card: rivalBlocker, spent: false }],
          gigArea: [{ dieType: "d8", faceValue: 8 }],
        },
      );

      engine.attackRival(flathead, { as: P1 });
      engine.resolveAttack({ as: P1 }); // attack → rival reaction window

      // Flathead can't be blocked: the rival's useBlocker move is rejected.
      const failure = engine.expectFailure(() => engine.useBlocker(rivalBlocker, { as: P2 }));
      expect(failure.errorCode).toBe("CANT_BE_BLOCKED");
    });

    it("a rival BLOCKER CAN redirect Flathead's direct attack when P1 does NOT trail in Street Cred", () => {
      // P1 cred 8 (d8) ≥ P2 cred 1 (d4) → cantBeBlocked is NOT active.
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: flathead, spent: false, hasLag: false }],
          gigArea: [{ dieType: "d8", faceValue: 8 }],
        },
        {
          field: [{ card: rivalBlocker, spent: false }],
          gigArea: [{ dieType: "d4", faceValue: 1 }],
        },
      );

      engine.attackRival(flathead, { as: P1 });
      engine.resolveAttack({ as: P1 }); // attack → rival reaction window

      // Flathead CAN be blocked: the blocker redirects the direct attack into a fight.
      engine.useBlocker(rivalBlocker, { as: P2 });
      const attack = engine.getAttackState();
      expect(attack?.redirectedByBlocker).toBe(true);
      expect(attack?.kind).toBe("fight");
    });
  });
});
