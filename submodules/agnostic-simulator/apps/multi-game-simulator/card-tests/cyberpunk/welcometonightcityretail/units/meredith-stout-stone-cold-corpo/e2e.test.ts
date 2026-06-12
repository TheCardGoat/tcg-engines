import { test } from "@playwright/test";

import {
  alphaKiroshiOptics,
  alphaRuthlessLowlife,
  welcomeToNightCityRetailMeredithStoutStoneColdCorpo,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import {
  expectIncludes,
  getZoneDefinitionIds,
} from "@cyberpunk/testing/fixture-behaviors/cyberpunk-unit-fixture-helpers";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { unitMeredithStoutStoneColdCorpoRetail } from "@cyberpunk/testing/e2e-fixtures";

test("Meredith Stout (Retail) - structural state on rival turn", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(
    page,
    unitMeredithStoutStoneColdCorpoRetail,
  );

  await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    welcomeToNightCityRetailMeredithStoutStoneColdCorpo.id,
  );

  await pom.expectTrashSize(CYBERPUNK_P1, 2);
  const trashDefinitions = await getZoneDefinitionIds(pom, "trash", CYBERPUNK_P1);
  expectIncludes("Meredith trash definitions", trashDefinitions, alphaKiroshiOptics.id);
  expectIncludes("Meredith trash definitions", trashDefinitions, alphaRuthlessLowlife.id);
  expectEqual("Meredith active player is P2", await pom.getActivePlayerId(), CYBERPUNK_P2);

  await pom.expectStructuralState();
});
