import { describe, expect, it } from "vite-plus/test";
import { alphaCorpoSecurity, alphaMantisBlades, alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Mantis Blades", () => {
  it("adds its power to the equipped unit during a fight", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: alphaSwordwiseHuscle,
            spent: false,
            playedThisTurn: false,
            attachedGears: [alphaMantisBlades],
          },
        ],
      },
      {
        field: [{ card: alphaCorpoSecurity, spent: true }],
      },
    );
    const host = engine.getCard(alphaSwordwiseHuscle, "field", P1);

    expect(getEffectivePower(engine.getState(), host.instanceId)).toBe(7);
    expect(engine.attackUnit(alphaSwordwiseHuscle, alphaCorpoSecurity, { as: P1 })).toMatchObject({
      success: true,
    });
    expect(engine.getState().G.attackState).toMatchObject({
      kind: "fight",
      defenderId: engine.findCardId(alphaCorpoSecurity, "field", P2),
    });
  });
});
