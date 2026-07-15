import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectNoPendingChoice,
} from "@cyberpunk-engine/testing/index.ts";
import { getEffectivePower } from "@cyberpunk-engine/active-effects";
import {
  welcomeToNightCityRetailGorillaArms,
  welcomeToNightCityRetailRidingNomad,
} from "@tcg/cyberpunk-cards";

const gorillaArms = welcomeToNightCityRetailGorillaArms; // gear, cost 4, power +3
const host = welcomeToNightCityRetailRidingNomad; // unit, ADRENALINE (can attack turn played)

describe("Gorilla Arms", () => {
  it("attaches to a friendly Unit and adds its printed power to the host", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [gorillaArms],
      field: [{ card: host, spent: false, hasLag: false }],
      eddies: gorillaArms.cost,
    });
    const hostBefore = engine.getCard(host, "field", P1);
    const powerBefore = getEffectivePower(engine.getState(), hostBefore.instanceId);

    engine.attachGear(gorillaArms, host, { as: P1 });

    const hostAfter = engine.getCard(host, "field", P1);
    expect(hostAfter.meta.attachedGearIds).toHaveLength(1);
    // Behavioral: the host's effective power increases by the gear's printed power.
    expect(getEffectivePower(engine.getState(), hostAfter.instanceId)).toBe(
      powerBefore + gorillaArms.power,
    );
  });

  describe("first-time steal: steal a rival Gig with a value NOT shared by a friendly Gig", () => {
    it("offers NO Gorilla Arms choice when every rival Gig value is already shared by a friendly Gig", () => {
      // Friendly gigs: 2, 5. Rival gigs: 2, 5 (both shared). The host steals one
      // during the attack; after that, every remaining rival value is shared, so
      // Gorilla Arms has no eligible target and creates no extra-steal choice.
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: host, spent: false, hasLag: false }],
          hand: [gorillaArms],
          eddies: gorillaArms.cost,
          gigArea: [
            { dieType: "d4", faceValue: 2 },
            { dieType: "d6", faceValue: 5 },
          ],
        },
        {
          gigArea: [
            { dieType: "d4", faceValue: 2 },
            { dieType: "d6", faceValue: 5 },
          ],
        },
        { autoGainGig: false },
      );
      engine.attachGear(gorillaArms, host, { as: P1 });
      const stealTarget = engine.getGigDice(P2).find((d) => d.faceValue === 2)!;

      engine.attackRival(host, { as: P1 });
      engine.resolveAttack({ as: P1 });
      engine.resolveAttack({ as: P2, pass: true });
      engine.resolveAttack({ as: P1, gigIdsToSteal: [stealTarget.id] });

      // The only remaining rival gig (value 5) is shared by a friendly gig (5),
      // so Gorilla Arms has no eligible target and does not prompt.
      expectNoPendingChoice(engine);
    });
  });
});
