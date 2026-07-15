import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailSaulBrightStormrider,
  welcomeToNightCityRetailSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Saul Bright - Stormrider", () => {
  it("gives another friendly attacking Unit +2 power and readies up to 3 Units", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          welcomeToNightCityRetailSaulBrightStormrider,
          { card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false },
          { card: welcomeToNightCityRetailSwordwiseHuscle, spent: true, hasLag: false },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );

    const attackerId = engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P1);
    engine.attackUnit(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );
    expect(getEffectivePower(engine.getState(), attackerId)).toBe(
      welcomeToNightCityRetailFieldOperator.power + 2,
    );
    engine.resolveFullFight({ as: P1 });

    engine.completeTurn({ as: P1 });
    const spentUnitId = engine.findCardId(welcomeToNightCityRetailSwordwiseHuscle, "field", P1);
    engine.resolveEffectTargetIds([spentUnitId], { as: P1 });

    expect(engine.getCard(welcomeToNightCityRetailSwordwiseHuscle, "field", P1).meta.spent).toBe(
      false,
    );
    expect(engine.getActivePlayerId()).toBe(P2);
  });

  it("can choose zero end-turn ready targets", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          welcomeToNightCityRetailSaulBrightStormrider,
          { card: welcomeToNightCityRetailSwordwiseHuscle, spent: true, hasLag: false },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );

    engine.completeTurn({ as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    if (choice?.type !== "chooseTarget" || choice.payload.type !== "effectTarget") {
      throw new Error("Expected Saul's end-turn ready ability to ask for effect targets.");
    }
    expect(choice.payload.min).toBe(0);
    expect(choice.payload.max).toBe(3);

    engine.resolveEffectTargetIds([], { as: P1 });

    expect(engine.getCard(welcomeToNightCityRetailSwordwiseHuscle, "field", P1).meta.spent).toBe(
      true,
    );
    expect(engine.getActivePlayerId()).toBe(P2);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });
});
