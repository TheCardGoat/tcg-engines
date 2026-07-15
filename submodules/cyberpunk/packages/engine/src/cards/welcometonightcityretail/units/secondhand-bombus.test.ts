import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailSecondhandBombus,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Secondhand Bombus (retail)", () => {
  it("spends as BLOCKER to redirect a rival direct attack into a fight", () => {
    // Printed text: "{Blocker} (You may spend this Unit to redirect a rival
    // Unit's attack to it instead.)"
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailSecondhandBombus, spent: false }],
      },
      {
        field: [{ card: embracingPowerRetailStarterDeckMinotaur, spent: false, hasLag: false }],
      },
    );

    // Hand the turn to P2 so P2 can declare an attack.
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(embracingPowerRetailStarterDeckMinotaur, { as: P2 });
    engine.resolveAttack({ as: P2 }); // attack → react

    expect(engine.useBlocker(welcomeToNightCityRetailSecondhandBombus, { as: P1 })).toMatchObject({
      success: true,
    });

    // Bombus spent, attack redirected from direct → fight.
    expect(engine.getCard(welcomeToNightCityRetailSecondhandBombus, "field", P1).meta.spent).toBe(
      true,
    );
    expect(engine.getState().G.attackState?.kind).toBe("fight");
  });

  it("steals 0 Gigs on a direct attack because power is 0", () => {
    // Printed reminder: "(Units with power 0 don't steal Gigs.)"
    // Secondhand Bombus has 0 power → direct attack resolves but steals 0.
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailSecondhandBombus,
            spent: false,
            hasLag: false,
          },
        ],
      },
      {
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );

    expect(engine.getGigCount(P1)).toBe(0);
    expect(engine.getGigCount(P2)).toBe(1);

    engine.attackRival(welcomeToNightCityRetailSecondhandBombus, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    // Direct attack resolved but 0 power → 0 Gigs stolen.
    expect(engine.getGigCount(P1)).toBe(0);
    expect(engine.getGigCount(P2)).toBe(1);
  });
});
