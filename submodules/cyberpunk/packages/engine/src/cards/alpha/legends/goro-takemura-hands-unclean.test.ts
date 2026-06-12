import { describe, expect, it } from "vite-plus/test";
import { alphaArmoredMinotaur, alphaGoroTakemuraHandsUnclean } from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Goro Takemura - Hands Unclean", () => {
  it("goes solo as a 7-power unit with BLOCKER", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: alphaGoroTakemuraHandsUnclean, faceDown: false }],
        eddies: 5,
      },
      {
        field: [{ card: alphaArmoredMinotaur, spent: false, playedThisTurn: false }],
      },
    );
    const goroId = engine.findCardId(alphaGoroTakemuraHandsUnclean, "legendArea", P1);

    expect(engine.executeMove("goSolo", { args: { cardId: goroId } }, P1)).toMatchObject({
      success: true,
    });
    const goro = engine.getCard(alphaGoroTakemuraHandsUnclean, "field", P1);
    expect(getEffectivePower(engine.getState(), goro.instanceId)).toBe(7);
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(alphaArmoredMinotaur, { as: P2 });
    engine.resolveAttack({ as: P2 });

    expect(engine.useBlocker(alphaGoroTakemuraHandsUnclean, { as: P1 })).toMatchObject({
      success: true,
    });
    expect(engine.getCard(alphaGoroTakemuraHandsUnclean, "field", P1).meta.spent).toBe(true);
  });
});
