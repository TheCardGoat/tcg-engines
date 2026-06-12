import { describe, expect, it } from "vite-plus/test";
import { alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Swordwise Huscle", () => {
  it("attacks as a ready 5-power vanilla Arasaka Merc", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: alphaSwordwiseHuscle, spent: false, playedThisTurn: false }],
    });

    const swordwise = engine.getCard(alphaSwordwiseHuscle, "field", P1);
    expect(getEffectivePower(engine.getState(), swordwise.instanceId)).toBe(5);
    expect(engine.attackRival(alphaSwordwiseHuscle, { as: P1 })).toMatchObject({ success: true });
    expect(engine.getCard(alphaSwordwiseHuscle, "field", P1).meta.spent).toBe(true);
    expect(engine.getState().G.attackState).toMatchObject({ kind: "direct" });
  });

  it("cannot attack on the turn it entered play", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: alphaSwordwiseHuscle, spent: false, playedThisTurn: true }],
    });

    const failure = engine.expectFailure(() =>
      engine.attackRival(alphaSwordwiseHuscle, { as: P1 }),
    );

    expect(failure.errorCode).toBe("SUMMONING_SICKNESS");
  });
});
