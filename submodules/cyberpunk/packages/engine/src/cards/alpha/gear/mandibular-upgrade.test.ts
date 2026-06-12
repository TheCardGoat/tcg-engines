import { describe, expect, it } from "vite-plus/test";
import {
  alphaArmoredMinotaur,
  alphaMandibularUpgrade,
  alphaSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Mandibular Upgrade", () => {
  it("grants BLOCKER to the equipped unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: alphaSwordwiseHuscle,
            spent: false,
            attachedGears: [alphaMandibularUpgrade],
          },
        ],
      },
      {
        field: [{ card: alphaArmoredMinotaur, spent: false, playedThisTurn: false }],
      },
    );
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(alphaArmoredMinotaur, { as: P2 });
    engine.resolveAttack({ as: P2 });

    expect(engine.useBlocker(alphaSwordwiseHuscle, { as: P1 })).toMatchObject({ success: true });
    expect(engine.getCard(alphaSwordwiseHuscle, "field", P1).meta.spent).toBe(true);
    expect(engine.getState().G.attackState).toMatchObject({ kind: "fight" });
  });
});
