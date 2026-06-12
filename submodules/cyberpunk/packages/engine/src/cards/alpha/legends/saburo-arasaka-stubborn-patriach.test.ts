import { describe, expect, it } from "vite-plus/test";
import {
  alphaArmoredMinotaur,
  alphaCorpoSecurity,
  alphaRuthlessLowlife,
  alphaSaburoArasakaStubbornPatriach,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Saburo Arasaka - Stubborn Patriarch", () => {
  it("gives friendly Arasaka units +1 power while attacking only", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: alphaArmoredMinotaur, spent: false, playedThisTurn: false },
          { card: alphaRuthlessLowlife, spent: false, playedThisTurn: false },
        ],
        legendArea: [{ card: alphaSaburoArasakaStubbornPatriach, faceDown: false }],
      },
      {
        field: [{ card: alphaCorpoSecurity, spent: true }],
      },
    );
    const minotaur = engine.getCard(alphaArmoredMinotaur, "field", P1);
    const lowlife = engine.getCard(alphaRuthlessLowlife, "field", P1);

    expect(getEffectivePower(engine.getState(), minotaur.instanceId)).toBe(9);
    engine.attackUnit(alphaArmoredMinotaur, alphaCorpoSecurity, { as: P1 });

    expect(getEffectivePower(engine.getState(), minotaur.instanceId)).toBe(10);
    expect(getEffectivePower(engine.getState(), lowlife.instanceId)).toBe(1);
  });
});
