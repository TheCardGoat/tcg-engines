import { describe, expect, it } from "vite-plus/test";
import { alphaRuthlessLowlife, alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Ruthless Lowlife", () => {
  it("sets a stolen friendly Gig to value 1 when Ruthless Lowlife is spent", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: alphaRuthlessLowlife, spent: true }],
        gigArea: [{ dieType: "d4", faceValue: 4 }],
      },
      {
        field: [{ card: alphaSwordwiseHuscle, spent: false, playedThisTurn: false }],
      },
    );
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });

    engine.attackRival(alphaSwordwiseHuscle, { as: P2 });
    engine.resolveAttack({ as: P2 });
    engine.resolveAttack({ as: P1, pass: true });
    engine.resolveAttack({ as: P2 });

    expect(engine.getGigCount(P1)).toBe(0);
    const stolen = engine.getGigDice(P2).find((die) => die.dieType === "d4");
    expect(stolen?.faceValue).toBe(1);
  });

  it("does not change the stolen Gig value while Ruthless Lowlife is ready", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: alphaRuthlessLowlife, spent: false }],
        gigArea: [{ dieType: "d4", faceValue: 4 }],
      },
      {
        field: [{ card: alphaSwordwiseHuscle, spent: false, playedThisTurn: false }],
      },
    );
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });

    engine.attackRival(alphaSwordwiseHuscle, { as: P2 });
    engine.resolveAttack({ as: P2 });
    engine.resolveAttack({ as: P1, pass: true });
    engine.resolveAttack({ as: P2 });

    const stolen = engine.getGigDice(P2).find((die) => die.dieType === "d4");
    expect(stolen?.faceValue).toBe(4);
  });
});
