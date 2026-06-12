import { describe, expect, it } from "vite-plus/test";
import { alphaArmoredMinotaur, alphaSecondhandBombus } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Secondhand Bombus", () => {
  it("spends as BLOCKER to redirect a rival direct attack", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: alphaSecondhandBombus, spent: false }] },
      { field: [{ card: alphaArmoredMinotaur, spent: false }] },
    );
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(alphaArmoredMinotaur, { as: P2 });
    engine.resolveAttack({ as: P2 });

    expect(engine.useBlocker(alphaSecondhandBombus, { as: P1 })).toMatchObject({ success: true });

    expect(engine.getCard(alphaSecondhandBombus, "field", P1).meta.spent).toBe(true);
    expect(engine.getState().G.attackState?.kind).toBe("fight");
  });

  it("cannot attack even when ready and lag-free", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: alphaSecondhandBombus, spent: false, playedThisTurn: false }],
    });

    const failure = engine.expectFailure(() =>
      engine.attackRival(alphaSecondhandBombus, { as: P1 }),
    );

    expect(failure.errorCode).toBe("CANT_ATTACK");
  });
});
