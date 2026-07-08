import { describe, expect, it } from "vite-plus/test";
import {
  alphaArmoredMinotaur,
  alphaGoroTakemuraHandsUnclean,
  alphaRuthlessLowlife,
  alphaVCorporateExile,
  welcomeToNightCityRetailMandibularUpgrade,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2, expectAttachTarget } from "../../../testing/index.ts";

describe("Mandibular Upgrade", () => {
  function getAttachTargets(engine: CyberpunkTestEngine): string[] {
    const gearId = engine.getCard(welcomeToNightCityRetailMandibularUpgrade, "hand", P1).instanceId;
    const playMove = engine.getPrompt(P1).availableMoves.find((move) => move.moveId === "playCard");
    if (!playMove || playMove.inputSpec.type !== "playCard") return [];
    return (
      playMove.inputSpec.candidates.find((candidate) => candidate.cardId === gearId)
        ?.attachTargets ?? []
    );
  }

  it("can attach to a friendly Unit or face-up Legend, but not a face-down Legend", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailMandibularUpgrade],
      field: [{ card: alphaRuthlessLowlife, spent: false }],
      legendArea: [
        { card: alphaVCorporateExile, faceDown: false },
        { card: alphaGoroTakemuraHandsUnclean, faceDown: true },
      ],
      eddies: 1,
    });

    expectAttachTarget(engine, welcomeToNightCityRetailMandibularUpgrade, alphaRuthlessLowlife);
    const attachTargets = getAttachTargets(engine);
    expect(attachTargets).toContain(
      engine.getCard(alphaVCorporateExile, "legendArea", P1).instanceId,
    );
    expect(attachTargets).not.toContain(
      engine.getCard(alphaGoroTakemuraHandsUnclean, "legendArea", P1).instanceId,
    );
  });

  it("grants BLOCKER to the attached host", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailMandibularUpgrade],
        field: [{ card: alphaRuthlessLowlife, spent: false }],
        eddies: 1,
      },
      {
        field: [{ card: alphaArmoredMinotaur, spent: false, playedThisTurn: false }],
      },
    );

    engine.attachGear(welcomeToNightCityRetailMandibularUpgrade, alphaRuthlessLowlife, { as: P1 });
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(alphaArmoredMinotaur, { as: P2 });
    engine.resolveAttack({ as: P2 });
    engine.useBlocker(alphaRuthlessLowlife, { as: P1 });

    expect(engine.getCard(alphaRuthlessLowlife, "field", P1).meta.spent).toBe(true);
    expect(engine.getState().G.attackState).toMatchObject({ kind: "fight" });
  });
});
