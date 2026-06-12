import { describe, expect, it } from "vite-plus/test";
import { alphaCorpoSecurity, alphaRuthlessLowlife } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Corpo Security", () => {
  it("can spend as BLOCKER to redirect a rival direct attack", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: alphaCorpoSecurity, spent: false }],
      },
      {
        field: [{ card: alphaRuthlessLowlife, spent: false }],
      },
    );
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(alphaRuthlessLowlife, { as: P2 });
    engine.resolveAttack({ as: P2 });

    expect(engine.useBlocker(alphaCorpoSecurity, { as: P1 })).toMatchObject({ success: true });

    expect(engine.getCard(alphaCorpoSecurity, "field", P1).meta.spent).toBe(true);
    expect(engine.getState().G.attackState?.kind).toBe("fight");
  });

  it("cannot be declared as an attacker even when ready and lag-free", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: alphaCorpoSecurity, spent: false, playedThisTurn: false }],
      },
      {},
    );

    const failure = engine.expectFailure(() => engine.attackRival(alphaCorpoSecurity, { as: P1 }));

    expect(failure.errorCode).toBe("CANT_ATTACK");
  });
});
