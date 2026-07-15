import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorporateSurveillance,
  welcomeToNightCityRetailDyingNightVSPistol,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailMeredithStoutStoneColdCorpo,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Meredith Stout - Stone Cold Corpo", () => {
  it("can return a trash card when a rival decreases a friendly Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [welcomeToNightCityRetailMeredithStoutStoneColdCorpo],
        trash: [welcomeToNightCityRetailCorporateSurveillance],
        gigArea: [{ dieType: "d8", faceValue: 5 }],
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            playedThisTurn: false,
            attachedGears: [welcomeToNightCityRetailDyingNightVSPistol],
          },
        ],
      },
      { activePlayerId: P2 },
    );

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P2 });
    engine.resolveAdjustGig(4, { as: P2 });
    const triggerChoice = engine.getState().G.turnMetadata.pendingChoice;
    if (triggerChoice?.type === "chooseTrigger") {
      const trigger = triggerChoice.payload.options[0];
      if (!trigger) throw new Error("Expected Meredith trigger option.");
      engine.executeMove("resolveTrigger", { args: { triggerId: trigger.triggerId } }, P1);
    }
    engine.resolveEffectTarget(welcomeToNightCityRetailCorporateSurveillance, {
      as: P1,
      allowPendingChoice: true,
      reason: "Meredith still needs the selected trash card move confirmed",
    });
    engine.resolveCardToMove(welcomeToNightCityRetailCorporateSurveillance, { as: P1 });

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorporateSurveillance.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).not.toContain(
      welcomeToNightCityRetailCorporateSurveillance.id,
    );
  });
});
