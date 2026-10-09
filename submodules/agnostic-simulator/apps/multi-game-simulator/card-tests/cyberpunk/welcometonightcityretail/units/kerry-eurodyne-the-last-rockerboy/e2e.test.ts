import { expect, test } from "@playwright/test";

import { welcomeToNightCityRetailKerryEurodyneTheLastRockerboy } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { unitKerryEurodyneTheLastRockerboyRetail } from "@cyberpunk/testing/e2e-fixtures";

test("Kerry Eurodyne (Retail) - spend with 8+ value gig draws two", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(
    page,
    unitKerryEurodyneTheLastRockerboyRetail,
  );

  const kerry = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    welcomeToNightCityRetailKerryEurodyneTheLastRockerboy.id,
  );
  const handBefore = await pom.getHandSize(CYBERPUNK_P1);
  const deckBefore = await pom.getDeckSize(CYBERPUNK_P1);

  await page.locator(`[data-testid="card"][data-instance-id="${kerry.instanceId}"]`).click();
  await page.locator('[data-action-id^="activateAbility:"]').click();

  await pom.expectFieldCardSpent(CYBERPUNK_P1, kerry.instanceId, true);
  await pom.expectHandSize(CYBERPUNK_P1, handBefore + 2);
  expectEqual("Kerry deck after draw", await pom.getDeckSize(CYBERPUNK_P1), deckBefore - 2);

  await pom.expectStructuralState();
});

test("Kerry offers rival attack and ability when no unit can be attacked", async ({
  page,
}, testInfo) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(
    page,
    unitKerryEurodyneTheLastRockerboyRetail,
  );
  const kerry = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    welcomeToNightCityRetailKerryEurodyneTheLastRockerboy.id,
  );
  const handBefore = await pom.getHandSize(CYBERPUNK_P1);
  expect(await pom.getMoveCandidateIds(CYBERPUNK_P1, "attackUnit")).not.toContain(kerry.instanceId);
  await page.locator(`[data-testid="card"][data-instance-id="${kerry.instanceId}"]`).click();
  await expect(page.locator("[data-card-context-menu]")).toBeVisible();
  await expect(page.locator('[data-action-id^="attackRival:"]')).toBeEnabled();
  await expect(page.locator('[data-action-id^="activateAbility:"]')).toBeEnabled();
  await pom.expectFieldCardSpent(CYBERPUNK_P1, kerry.instanceId, false);
  await pom.expectHandSize(CYBERPUNK_P1, handBefore);
  await page.screenshot({ path: testInfo.outputPath("kerry-choice.png") });
  await page.locator('[data-action-id^="attackRival:"]').click();
  expect(await pom.getAttackState()).toMatchObject({
    kind: "direct",
    attackerId: kerry.instanceId,
  });
  await pom.expectFieldCardSpent(CYBERPUNK_P1, kerry.instanceId, true);
  await pom.expectHandSize(CYBERPUNK_P1, handBefore);
});
