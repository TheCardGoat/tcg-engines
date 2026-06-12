import { alphaArmoredMinotaur } from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1, CYBERPUNK_P2 } from "../cyberpunk-simulator-pom";
import {
  expectDefined,
  expectEqual,
  type CyberpunkFixtureBehavior,
} from "./cyberpunk-fixture-behavior";

export const progCorporateSurveillanceNoTargetsBehavior: CyberpunkFixtureBehavior = {
  scenarioId: "progCorporateSurveillanceNoTargets",
  label: "Corporate Surveillance - no valid targets",
  references: ["packages/engine/src/cards/alpha/programs/corporate-surveillance.test.ts"],
  async run(pom) {
    const minotaur = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      alphaArmoredMinotaur.id,
    );
    const program = expectDefined(
      "Corporate Surveillance in hand",
      (await pom.getCardsInZone("hand", CYBERPUNK_P1))[0],
    );

    await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
    expectEqual(
      "Corporate Surveillance no-target eligible count",
      (await pom.getEligibleTargetIds(CYBERPUNK_P1)).length,
      0,
    );
    await pom.expectFieldCardSpent(CYBERPUNK_P2, minotaur.instanceId, false);
    await pom.expectHandSize(CYBERPUNK_P1, 0);
    await pom.expectTrashSize(CYBERPUNK_P1, 1);
    await pom.expectEddies(CYBERPUNK_P1, 1);
  },
};
