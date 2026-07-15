import { describe, expect, it } from "vite-plus/test";
import {
  boxTopperRetailGoroTakemuraHandsUnclean,
  boxTopperRetailVCorporateExile,
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailFieldOperator,
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
      field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
      legendArea: [
        { card: boxTopperRetailVCorporateExile, faceDown: false },
        { card: boxTopperRetailGoroTakemuraHandsUnclean, faceDown: true },
      ],
      eddies: 1,
    });

    expectAttachTarget(
      engine,
      welcomeToNightCityRetailMandibularUpgrade,
      welcomeToNightCityRetailFieldOperator,
    );
    const attachTargets = getAttachTargets(engine);
    expect(attachTargets).toContain(
      engine.getCard(boxTopperRetailVCorporateExile, "legendArea", P1).instanceId,
    );
    expect(attachTargets).not.toContain(
      engine.getCard(boxTopperRetailGoroTakemuraHandsUnclean, "legendArea", P1).instanceId,
    );
  });

  it("has no attach targets when there is no friendly Unit or face-up Legend", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailMandibularUpgrade],
      legendArea: [{ card: boxTopperRetailVCorporateExile, faceDown: true }],
      eddies: 1,
    });

    expect(getAttachTargets(engine)).toEqual([]);
  });

  it("grants BLOCKER to the attached host", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailMandibularUpgrade],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
        eddies: 1,
      },
      {
        field: [
          {
            card: embracingPowerRetailStarterDeckMinotaur,
            spent: false,
            hasLag: false,
          },
        ],
      },
    );

    engine.attachGear(
      welcomeToNightCityRetailMandibularUpgrade,
      welcomeToNightCityRetailFieldOperator,
      {
        as: P1,
      },
    );
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(embracingPowerRetailStarterDeckMinotaur, { as: P2 });
    engine.resolveAttack({ as: P2 });
    engine.useBlocker(welcomeToNightCityRetailFieldOperator, { as: P1 });

    expect(engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1).meta.spent).toBe(
      true,
    );
    expect(engine.getState().G.attackState).toMatchObject({ kind: "fight" });
  });
});
