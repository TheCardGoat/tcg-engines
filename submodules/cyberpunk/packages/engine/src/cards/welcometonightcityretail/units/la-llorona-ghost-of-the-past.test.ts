import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailLaLloronaGhostOfThePast,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("La Llorona - Ghost of the Past", () => {
  it("uses BLOCKER, then chooses a friendly Gig to increase", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailLaLloronaGhostOfThePast, spent: false }],
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      },
      {
        field: [
          { card: welcomeToNightCityRetailFieldOperator, spent: false, playedThisTurn: false },
        ],
      },
    );

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P2 });
    engine.resolveAttack({ as: P2 });
    engine.useBlocker(welcomeToNightCityRetailLaLloronaGhostOfThePast, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    const dieId = engine.getGigDice(P1)[0]!.id as string;
    engine.resolveEffectTargetIds([dieId], {
      as: P1,
      allowPendingChoice: true,
      reason: "La Llorona still needs the selected Gig's new face value",
    });
    engine.resolveAdjustGig(5, { as: P1 });

    expect(engine.getGigValue(P1)).toBe(5);
  });
});
