import { describe, expect, it } from "vite-plus/test";
import { alphaCorpoSecurity, alphaMt0d12Flathead } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("MT0D12 Flathead", () => {
  it("cannot be blocked while friendly Street Cred is at least 7", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: alphaMt0d12Flathead, spent: false, playedThisTurn: false }],
        gigArea: [{ dieType: "d8", faceValue: 7 }],
      },
      {
        field: [{ card: alphaCorpoSecurity, spent: false }],
      },
    );

    engine.attackRival(alphaMt0d12Flathead, { as: P1 });
    engine.resolveAttack({ as: P1 });

    const failure = engine.expectFailure(() => engine.useBlocker(alphaCorpoSecurity, { as: P2 }));
    expect(failure.errorCode).toBe("CANT_BE_BLOCKED");
  });

  it("can be blocked below 7 Street Cred", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: alphaMt0d12Flathead, spent: false, playedThisTurn: false }],
        gigArea: [{ dieType: "d4", faceValue: 6 }],
      },
      {
        field: [{ card: alphaCorpoSecurity, spent: false }],
      },
    );

    engine.attackRival(alphaMt0d12Flathead, { as: P1 });
    engine.resolveAttack({ as: P1 });

    expect(engine.useBlocker(alphaCorpoSecurity, { as: P2 })).toMatchObject({ success: true });
    expect(engine.getState().G.attackState?.kind).toBe("fight");
  });
});
