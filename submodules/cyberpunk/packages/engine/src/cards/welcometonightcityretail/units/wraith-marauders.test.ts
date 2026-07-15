import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailSwordwiseHuscle,
  welcomeToNightCityRetailWraithMarauders,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Wraith Marauders retail printing", () => {
  it("readies another friendly spent unit whose power equals the stolen Gig value", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: welcomeToNightCityRetailWraithMarauders, spent: false, hasLag: false },
          {
            card: welcomeToNightCityRetailSwordwiseHuscle,
            spent: true,
            hasLag: false,
            powerModifier: 2,
          },
          { card: embracingPowerRetailStarterDeckMinotaur, spent: true, hasLag: false },
        ],
      },
      {
        gigArea: [{ dieType: "d6", faceValue: 5 }],
      },
    );

    engine.attackRival(welcomeToNightCityRetailWraithMarauders, { as: P1 });
    engine.resolveAttack({ as: P1 });
    engine.resolveAttack({ as: P2, pass: true });
    engine.resolveAttack({ as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected chooseTarget choice.");
    const eligible = choice.payload.eligibleIds ?? [];
    expect(eligible).toContain(
      engine.findCardId(welcomeToNightCityRetailSwordwiseHuscle, "field", P1),
    );
    expect(eligible).not.toContain(
      engine.findCardId(embracingPowerRetailStarterDeckMinotaur, "field", P1),
    );

    engine.resolveEffectTarget(welcomeToNightCityRetailSwordwiseHuscle, { as: P1 });

    expect(engine.getCard(welcomeToNightCityRetailSwordwiseHuscle, "field", P1).meta.spent).toBe(
      false,
    );
    expect(engine.getCard(embracingPowerRetailStarterDeckMinotaur, "field", P1).meta.spent).toBe(
      true,
    );
  });
});
