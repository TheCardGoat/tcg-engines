import { expect, test } from "@playwright/test";

import {
  welcomeToNightCityRetailMoxInciters,
  welcomeToNightCityRetailSecondhandBombus,
  welcomeToNightCityRetailSwordwiseHuscle,
  welcomeToNightCityRetailHanakoArasakaInAGildedCage,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import {
  expectExcludes,
  expectIncludes,
  getZoneDefinitionIds,
} from "@cyberpunk/testing/fixture-behaviors/cyberpunk-unit-fixture-helpers";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { unitHanakoArasakaInAGildedCageRetail } from "@cyberpunk/testing/e2e-fixtures";

test("Hanako Arasaka (Retail) - play trigger keeps top-deck cost matches", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(
    page,
    unitHanakoArasakaInAGildedCageRetail,
  );

  const hanako = await pom.getCardInZoneByDefinitionId(
    "hand",
    CYBERPUNK_P1,
    welcomeToNightCityRetailHanakoArasakaInAGildedCage.id,
  );

  expectEqual("Hanako initial deck size", await pom.getDeckSize(CYBERPUNK_P1), 40);
  await pom.playCardFromHand(hanako.instanceId, CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectFieldSize(CYBERPUNK_P1, 2);
  await pom.expectHandSize(CYBERPUNK_P1, 2);
  await pom.expectTrashSize(CYBERPUNK_P1, 0);
  expectEqual("Hanako deck after search", await pom.getDeckSize(CYBERPUNK_P1), 38);
  await pom.expectEddies(CYBERPUNK_P1, 0);
  await expect(page.locator('[data-testid="event-log"]')).toContainText(
    "Revealed 2 searched card(s): Swordwise Huscle, Mox Inciters.",
  );
  await expect(page.locator('[data-testid="event-log"]')).toContainText(
    "Searched the top 4 cards and added Swordwise Huscle, Mox Inciters to hand. Bottom-decked 2.",
  );

  const handDefinitions = await getZoneDefinitionIds(pom, "hand", CYBERPUNK_P1);
  expectIncludes(
    "Hanako hand definitions",
    handDefinitions,
    welcomeToNightCityRetailSwordwiseHuscle.id,
  );
  expectIncludes(
    "Hanako hand definitions",
    handDefinitions,
    welcomeToNightCityRetailMoxInciters.id,
  );
  expectExcludes(
    "Hanako hand definitions",
    handDefinitions,
    welcomeToNightCityRetailSecondhandBombus.id,
  );

  await pom.expectStructuralState();
});
