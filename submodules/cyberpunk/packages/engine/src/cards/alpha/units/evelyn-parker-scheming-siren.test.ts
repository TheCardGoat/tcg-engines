import { describe, expect, it } from "vite-plus/test";
import {
  alphaEvelynParkerSchemingSiren,
  alphaRuthlessLowlife,
  alphaSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Evelyn Parker - Scheming Siren", () => {
  it("draws a card when a rival steals a friendly Gig while Evelyn is spent", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: alphaEvelynParkerSchemingSiren, spent: true }],
        deck: [alphaRuthlessLowlife],
        gigArea: [{ dieType: "d8", faceValue: 4 }],
      },
      {
        field: [{ card: alphaSwordwiseHuscle, spent: false, playedThisTurn: false }],
      },
    );
    const handBefore = engine.getCardsInZone("hand", P1).length;
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });

    engine.attackRival(alphaSwordwiseHuscle, { as: P2 });
    engine.resolveAttack({ as: P2 });
    engine.resolveAttack({ as: P1, pass: true });
    engine.resolveAttack({ as: P2 });

    expect(engine.getCardsInZone("hand", P1)).toHaveLength(handBefore + 1);
  });

  it("does not draw when the same Gig is stolen while Evelyn is ready", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: alphaEvelynParkerSchemingSiren, spent: false }],
        deck: [alphaRuthlessLowlife],
        gigArea: [{ dieType: "d8", faceValue: 4 }],
      },
      {
        field: [{ card: alphaSwordwiseHuscle, spent: false, playedThisTurn: false }],
      },
    );
    const handBefore = engine.getCardsInZone("hand", P1).length;
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });

    engine.attackRival(alphaSwordwiseHuscle, { as: P2 });
    engine.resolveAttack({ as: P2 });
    engine.resolveAttack({ as: P1, pass: true });
    engine.resolveAttack({ as: P2 });

    expect(engine.getCardsInZone("hand", P1)).toHaveLength(handBefore);
  });
});
