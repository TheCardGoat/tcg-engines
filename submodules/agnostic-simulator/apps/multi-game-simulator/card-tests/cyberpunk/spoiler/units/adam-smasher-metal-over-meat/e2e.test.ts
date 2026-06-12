import { test } from "@playwright/test";

import {
  alphaArmoredMinotaur,
  alphaCorpoSecurity,
  alphaJackieWellesRideOrDieChoom,
  alphaSecondhandBombus,
  alphaSwordwiseHuscle,
  spoilerAdamSmasherMetalOverMeat,
} from "@tcg/cyberpunk-cards";
import {
  CYBERPUNK_P1,
  CYBERPUNK_P2,
} from "../../../../../src/games/cyberpunk/testing/cyberpunk-simulator-pom";
import {
  expectIncludes,
  getZoneDefinitionIds,
} from "../../../../../src/games/cyberpunk/testing/fixture-behaviors/cyberpunk-unit-fixture-helpers";

import { createPlaywrightCyberpunkSimulatorPom } from "../../../../../e2e/poms/CyberpunkPlaywrightHarnessClient";

test("Adam Smasher - play trigger defeats every other unit", async ({ page }) => {
  await page.goto(
    "/cyberpunk/simulator/tests/unitAdamSmasherMetalOverMeat?ai=off&auto-advance-attack=off",
  );

  const pom = createPlaywrightCyberpunkSimulatorPom(page);
  await pom.waitForReady();
  await pom.expectStructuralState();

  const adam = await pom.getCardInZoneByDefinitionId(
    "hand",
    CYBERPUNK_P1,
    spoilerAdamSmasherMetalOverMeat.id,
  );

  await pom.playCardFromHand(adam.instanceId, CYBERPUNK_P1);

  await pom.expectFieldSize(CYBERPUNK_P1, 1);
  await pom.expectFieldSize(CYBERPUNK_P2, 0);
  await pom.expectTrashSize(CYBERPUNK_P1, 2);
  await pom.expectTrashSize(CYBERPUNK_P2, 3);
  await pom.getCardInZoneByDefinitionId("field", CYBERPUNK_P1, spoilerAdamSmasherMetalOverMeat.id);

  const p1Trash = await getZoneDefinitionIds(pom, "trash", CYBERPUNK_P1);
  expectIncludes("Adam P1 trash", p1Trash, alphaSwordwiseHuscle.id);
  expectIncludes("Adam P1 trash", p1Trash, alphaSecondhandBombus.id);

  const p2Trash = await getZoneDefinitionIds(pom, "trash", CYBERPUNK_P2);
  expectIncludes("Adam P2 trash", p2Trash, alphaCorpoSecurity.id);
  expectIncludes("Adam P2 trash", p2Trash, alphaArmoredMinotaur.id);
  expectIncludes("Adam P2 trash", p2Trash, alphaJackieWellesRideOrDieChoom.id);

  await pom.expectStructuralState();
});
