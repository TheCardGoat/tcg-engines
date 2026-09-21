import { expect, test } from "@playwright/test";

import { welcomeToNightCityRetailTrustNoOne } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { progTrustNoOne } from "@cyberpunk/testing/e2e-fixtures";
import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";

test("Trust No One - a min Gig can keep its value and finish resolving", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, progTrustNoOne);
  const trustNoOne = await pom.getCardInZoneByDefinitionId(
    "hand",
    CYBERPUNK_P1,
    welcomeToNightCityRetailTrustNoOne.id,
  );
  const minGig = (await pom.getGigDice(CYBERPUNK_P1))[0]!;

  await pom.expectGigValue(minGig.id, 1);
  await pom.playCardFromHand(trustNoOne.instanceId, CYBERPUNK_P1);
  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

  await page.getByRole("button", { name: "Open choice modal", exact: true }).click();
  await page.getByRole("button", { name: "Select Your Gig: D4", exact: true }).click();

  const keepAtOne = page.getByTestId("prompt-adjust-gig-option");
  await expect(keepAtOne).toHaveAccessibleName("Keep at 1");
  await expect(keepAtOne).toBeVisible();
  await keepAtOne.click();

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectGigValue(minGig.id, 1);
  await pom.expectHandSize(CYBERPUNK_P1, 1);
  await pom.expectStructuralState();
});
