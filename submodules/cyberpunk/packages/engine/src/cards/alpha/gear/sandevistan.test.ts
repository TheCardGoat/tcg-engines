import { describe, expect, it } from "vite-plus/test";
import { alphaCorpoSecurity, alphaSandevistan, alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Sandevistan", () => {
  it("lets the equipped unit attack spent units on the turn it was played", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [alphaSwordwiseHuscle, alphaSandevistan],
        eddies: 6,
      },
      {
        field: [{ card: alphaCorpoSecurity, spent: true }],
      },
    );

    engine.playCard(alphaSwordwiseHuscle, { as: P1 });
    engine.attachGear(alphaSandevistan, alphaSwordwiseHuscle, { as: P1 });
    const host = engine.getCard(alphaSwordwiseHuscle, "field", P1);

    expect(getEffectivePower(engine.getState(), host.instanceId)).toBe(8);
    expect(engine.attackUnit(alphaSwordwiseHuscle, alphaCorpoSecurity, { as: P1 })).toMatchObject({
      success: true,
    });
    expect(engine.getState().G.attackState).toMatchObject({
      kind: "fight",
      defenderId: engine.findCardId(alphaCorpoSecurity, "field", P2),
    });
  });
});
