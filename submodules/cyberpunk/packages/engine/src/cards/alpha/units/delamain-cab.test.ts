import { describe, expect, it } from "vite-plus/test";
import { alphaDelamainCab } from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Delamain Cab", () => {
  it("attacks as a ready 7-power vanilla Vehicle", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: alphaDelamainCab, spent: false, playedThisTurn: false }],
    });

    const delamain = engine.getCard(alphaDelamainCab, "field", P1);
    expect(getEffectivePower(engine.getState(), delamain.instanceId)).toBe(7);
    expect(engine.attackRival(alphaDelamainCab, { as: P1 })).toMatchObject({ success: true });
    expect(engine.getCard(alphaDelamainCab, "field", P1).meta.spent).toBe(true);
    expect(engine.getState().G.attackState).toMatchObject({ kind: "direct" });
  });

  it("cannot attack on the turn it entered play", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: alphaDelamainCab, spent: false, playedThisTurn: true }],
    });

    const failure = engine.expectFailure(() => engine.attackRival(alphaDelamainCab, { as: P1 }));

    expect(failure.errorCode).toBe("SUMMONING_SICKNESS");
  });
});
