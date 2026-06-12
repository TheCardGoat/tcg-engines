import { test } from "@playwright/test";

import {
  alphaCorpoSecurity,
  alphaFloorIt,
  alphaRuthlessLowlife,
  alphaSecondhandBombus,
  alphaSwordwiseHuscle,
  spoilerHanakoArasakaInAGildedCage,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "../../../../../src/games/cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "../../../../../src/games/cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import {
  expectExcludes,
  expectIncludes,
  getZoneDefinitionIds,
} from "../../../../../src/games/cyberpunk/testing/fixture-behaviors/cyberpunk-unit-fixture-helpers";

import { createPlaywrightCyberpunkSimulatorPom } from "../../../../../e2e/poms/CyberpunkPlaywrightHarnessClient";

test("Hanako Arasaka - play trigger keeps top-deck cost matches", async ({ page }) => {
  await page.goto(
    "/cyberpunk/simulator/tests/unitHanakoArasakaInAGildedCage?ai=off&auto-advance-attack=off",
  );

  const pom = createPlaywrightCyberpunkSimulatorPom(page);
  await pom.waitForReady();
  await pom.expectStructuralState();

  const hanako = await pom.getCardInZoneByDefinitionId(
    "hand",
    CYBERPUNK_P1,
    spoilerHanakoArasakaInAGildedCage.id,
  );

  expectEqual("Hanako initial deck size", await pom.getDeckSize(CYBERPUNK_P1), 40);
  await pom.playCardFromHand(hanako.instanceId, CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectFieldSize(CYBERPUNK_P1, 2);
  await pom.expectHandSize(CYBERPUNK_P1, 2);
  await pom.expectTrashSize(CYBERPUNK_P1, 2);
  expectEqual("Hanako deck after search", await pom.getDeckSize(CYBERPUNK_P1), 36);
  await pom.expectEddies(CYBERPUNK_P1, 1);

  const handDefinitions = await getZoneDefinitionIds(pom, "hand", CYBERPUNK_P1);
  expectIncludes("Hanako hand definitions", handDefinitions, alphaSwordwiseHuscle.id);
  expectIncludes("Hanako hand definitions", handDefinitions, alphaFloorIt.id);
  expectExcludes("Hanako hand definitions", handDefinitions, alphaSecondhandBombus.id);

  const trashDefinitions = await getZoneDefinitionIds(pom, "trash", CYBERPUNK_P1);
  expectIncludes("Hanako trash definitions", trashDefinitions, alphaCorpoSecurity.id);
  expectIncludes("Hanako trash definitions", trashDefinitions, alphaRuthlessLowlife.id);

  await pom.expectStructuralState();
});
