import { test } from "@playwright/test";

import {
  alphaArmoredMinotaur,
  alphaCorpoSecurity,
  alphaJackieWellesRideOrDieChoom,
  alphaSecondhandBombus,
  alphaSwordwiseHuscle,
  welcomeToNightCityRetailAdamSmasherMetalOverMeat,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import {
  expectIncludes,
  getZoneDefinitionIds,
} from "@cyberpunk/testing/fixture-behaviors/cyberpunk-unit-fixture-helpers";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { unitAdamSmasherMetalOverMeatRetail } from "@cyberpunk/testing/e2e-fixtures";

test("Adam Smasher (Retail) - play trigger defeats every other unit", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, unitAdamSmasherMetalOverMeatRetail);

  const adam = await pom.getCardInZoneByDefinitionId(
    "hand",
    CYBERPUNK_P1,
    welcomeToNightCityRetailAdamSmasherMetalOverMeat.id,
  );

  await pom.playCardFromHand(adam.instanceId, CYBERPUNK_P1);

  await pom.expectFieldSize(CYBERPUNK_P1, 1);
  await pom.expectFieldSize(CYBERPUNK_P2, 0);
  await pom.expectTrashSize(CYBERPUNK_P1, 2);
  await pom.expectTrashSize(CYBERPUNK_P2, 3);
  await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    welcomeToNightCityRetailAdamSmasherMetalOverMeat.id,
  );

  const p1Trash = await getZoneDefinitionIds(pom, "trash", CYBERPUNK_P1);
  expectIncludes("Adam P1 trash", p1Trash, alphaSwordwiseHuscle.id);
  expectIncludes("Adam P1 trash", p1Trash, alphaSecondhandBombus.id);

  const p2Trash = await getZoneDefinitionIds(pom, "trash", CYBERPUNK_P2);
  expectIncludes("Adam P2 trash", p2Trash, alphaCorpoSecurity.id);
  expectIncludes("Adam P2 trash", p2Trash, alphaArmoredMinotaur.id);
  expectIncludes("Adam P2 trash", p2Trash, alphaJackieWellesRideOrDieChoom.id);

  await pom.expectStructuralState();
});
