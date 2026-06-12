import { describe, expect, it } from "vite-plus/test";
import { alphaEmergencyAtlus } from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Emergency Atlus", () => {
  it("attacks as a ready 7-power vanilla Vehicle Corpo", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: alphaEmergencyAtlus, spent: false, playedThisTurn: false }],
    });

    const atlus = engine.getCard(alphaEmergencyAtlus, "field", P1);
    expect(getEffectivePower(engine.getState(), atlus.instanceId)).toBe(7);
    expect(engine.attackRival(alphaEmergencyAtlus, { as: P1 })).toMatchObject({ success: true });
    expect(engine.getCard(alphaEmergencyAtlus, "field", P1).meta.spent).toBe(true);
    expect(engine.getState().G.attackState).toMatchObject({ kind: "direct" });
  });

  it("cannot attack on the turn it entered play", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: alphaEmergencyAtlus, spent: false, playedThisTurn: true }],
    });

    const failure = engine.expectFailure(() => engine.attackRival(alphaEmergencyAtlus, { as: P1 }));

    expect(failure.errorCode).toBe("SUMMONING_SICKNESS");
  });
});
