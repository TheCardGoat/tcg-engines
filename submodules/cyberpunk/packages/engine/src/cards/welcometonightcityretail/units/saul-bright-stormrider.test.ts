import { describe, expect, it } from "vite-plus/test";
import {
  alphaCorpoSecurity,
  alphaRuthlessLowlife,
  alphaSwordwiseHuscle,
  welcomeToNightCityRetailSaulBrightStormrider,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Saul Bright - Stormrider", () => {
  it("gives another friendly attacking Unit +2 power and readies up to 3 Units", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          welcomeToNightCityRetailSaulBrightStormrider,
          { card: alphaRuthlessLowlife, spent: false, playedThisTurn: false },
          { card: alphaSwordwiseHuscle, spent: true, playedThisTurn: false },
        ],
      },
      {
        field: [{ card: alphaCorpoSecurity, spent: true }],
      },
    );

    const attackerId = engine.findCardId(alphaRuthlessLowlife, "field", P1);
    engine.attackUnit(alphaRuthlessLowlife, alphaCorpoSecurity, { as: P1 });
    expect(getEffectivePower(engine.getState(), attackerId)).toBe(alphaRuthlessLowlife.power + 2);
    engine.resolveFullFight({ as: P1 });

    engine.completeTurn({ as: P1 });
    const spentUnitId = engine.findCardId(alphaSwordwiseHuscle, "field", P1);
    engine.resolveEffectTargetIds([spentUnitId], { as: P1 });

    expect(engine.getCard(alphaSwordwiseHuscle, "field", P1).meta.spent).toBe(false);
    expect(engine.getActivePlayerId()).toBe(P2);
  });
});
