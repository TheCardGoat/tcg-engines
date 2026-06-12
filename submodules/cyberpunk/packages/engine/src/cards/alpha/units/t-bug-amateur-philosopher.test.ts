import { describe, expect, it } from "vite-plus/test";
import { alphaTBugAmateurPhilosopher } from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("T-Bug - Amateur Philosopher", () => {
  it("attacks as a ready 5-power vanilla Netrunner Merc", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: alphaTBugAmateurPhilosopher, spent: false, playedThisTurn: false }],
    });

    const tBug = engine.getCard(alphaTBugAmateurPhilosopher, "field", P1);
    expect(getEffectivePower(engine.getState(), tBug.instanceId)).toBe(5);
    expect(engine.attackRival(alphaTBugAmateurPhilosopher, { as: P1 })).toMatchObject({
      success: true,
    });
    expect(engine.getCard(alphaTBugAmateurPhilosopher, "field", P1).meta.spent).toBe(true);
    expect(engine.getState().G.attackState).toMatchObject({ kind: "direct" });
  });

  it("cannot attack on the turn it entered play", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: alphaTBugAmateurPhilosopher, spent: false, playedThisTurn: true }],
    });

    const failure = engine.expectFailure(() =>
      engine.attackRival(alphaTBugAmateurPhilosopher, { as: P1 }),
    );

    expect(failure.errorCode).toBe("SUMMONING_SICKNESS");
  });
});
