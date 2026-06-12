import { test } from "@playwright/test";

import { spoilerPeaceOffering } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { progPeaceOffering } from "@cyberpunk/testing/e2e-fixtures";

test("Peace Offering - playing creates a two-Gig target choice", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, progPeaceOffering);

  const program = await pom.getCardInZoneByDefinitionId(
    "hand",
    CYBERPUNK_P1,
    spoilerPeaceOffering.id,
  );

  await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);

  const choiceType = await pom.getPendingChoiceType(CYBERPUNK_P1);
  expectEqual("Peace Offering choice", choiceType, "chooseTarget");

  await pom.expectStructuralState();
});
