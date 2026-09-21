import { test } from "@playwright/test";

import {
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import {
  expectDefined,
  expectEqual,
} from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { gearZetatechFaceplateRetail } from "@cyberpunk/testing/e2e-fixtures";

test("Zetatech Faceplate (Retail) - spend trigger adjusts a gig and draws", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, gearZetatechFaceplateRetail);

  const host = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    welcomeToNightCityRetailSwordwiseHuscle.id,
  );
  const rivalHost = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P2,
    welcomeToNightCityRetailDelamainCab.id,
  );
  const d8 = expectDefined(
    "Zetatech Retail friendly d8",
    (await pom.getGigDice(CYBERPUNK_P1)).find((die) => die.dieType === "d8"),
  );

  await pom.expectHandSize(CYBERPUNK_P1, 1);
  await pom.expectGigValue(d8.id, 3);
  await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, host.instanceId, 1);
  await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P2, rivalHost.instanceId, 1);

  await pom.attackRival(host.instanceId, CYBERPUNK_P1);
  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

  const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
  expectEqual("Zetatech Retail eligible gig target count", eligible.length, 4);
  if (!eligible.includes(d8.id)) {
    throw new Error("Expected friendly d8 to be an eligible Zetatech Faceplate target.");
  }

  await page
    .getByRole("button", { name: "Select D8, showing 3", exact: true })
    .dispatchEvent("click");
  await page.getByRole("button", { name: "Set to 4", exact: true }).click();

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectGigValue(d8.id, 4);
  await pom.expectHandSize(CYBERPUNK_P1, 3);

  await pom.expectStructuralState();
});

test("Zetatech Faceplate (Retail) - both players control it and active player takes none", async ({
  page,
}) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, gearZetatechFaceplateRetail);

  const host = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    welcomeToNightCityRetailSwordwiseHuscle.id,
  );
  const rivalHost = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P2,
    welcomeToNightCityRetailDelamainCab.id,
  );
  const d8 = expectDefined(
    "Zetatech Retail friendly d8",
    (await pom.getGigDice(CYBERPUNK_P1)).find((die) => die.dieType === "d8"),
  );

  await pom.expectHandSize(CYBERPUNK_P1, 1);
  await pom.expectGigValue(d8.id, 3);
  await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, host.instanceId, 1);
  await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P2, rivalHost.instanceId, 1);

  await pom.attackRival(host.instanceId, CYBERPUNK_P1);
  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
  await page.getByRole("button", { name: "Take none", exact: true }).click();

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectGigValue(d8.id, 3);
  await pom.expectHandSize(CYBERPUNK_P1, 3);
  await pom.expectHandSize(CYBERPUNK_P2, 0);
  await pom.expectStructuralState();
});
