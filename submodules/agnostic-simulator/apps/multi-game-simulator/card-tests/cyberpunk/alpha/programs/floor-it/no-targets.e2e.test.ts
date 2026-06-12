import { test } from "@playwright/test";

import { alphaJackieWellesRideOrDieChoom } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import {
  expectDefined,
  expectEqual,
} from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { progFloorItNoTargets } from "@cyberpunk/testing/e2e-fixtures";

test("Floor It - no spent low-cost units", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, progFloorItNoTargets);

  const jackie = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P2,
    alphaJackieWellesRideOrDieChoom.id,
  );
  const program = expectDefined(
    "Floor It in hand",
    (await pom.getCardsInZone("hand", CYBERPUNK_P1))[0],
  );

  await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  expectEqual(
    "Floor It no-target eligible count",
    (await pom.getEligibleTargetIds(CYBERPUNK_P1)).length,
    0,
  );
  await pom.expectFieldCardSpent(CYBERPUNK_P2, jackie.instanceId, true);
  await pom.expectFieldSize(CYBERPUNK_P2, 1);
  await pom.expectHandSize(CYBERPUNK_P1, 0);
  await pom.expectTrashSize(CYBERPUNK_P1, 1);
  await pom.expectEddies(CYBERPUNK_P1, 1);

  await pom.expectStructuralState();
});
