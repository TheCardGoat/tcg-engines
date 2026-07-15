import { expect, test } from "@playwright/test";

import {
  welcomeToNightCityRetailFoolOnTheHill,
  welcomeToNightCityRetailIndustrialAssembly,
  welcomeToNightCityRetailPeaceOffering,
  welcomeToNightCityRetailSketchyRipper,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";

test("Fool on the Hill - rival chooses revealed cards destination", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, {
    fixture: { scenarioId: "retailProgramTargetBench" },
  });

  const program = await pom.getCardInZoneByDefinitionId(
    "hand",
    CYBERPUNK_P1,
    welcomeToNightCityRetailFoolOnTheHill.id,
  );

  await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);

  const choiceType = await pom.getPendingChoiceType(CYBERPUNK_P2);
  expectEqual("Fool on the Hill choice", choiceType, "revealDestination");
  await pom.takeControl(CYBERPUNK_P2);

  await expect(page.getByTestId("reveal-destination-option")).toHaveCount(2);
  const choiceDialog = page.getByRole("dialog");
  await expect(choiceDialog).toContainText("2 cards revealed from the top of the deck.");
  const sketchyRipper = choiceDialog.getByRole("img", { name: "Sketchy Ripper" });
  await expect(sketchyRipper).toBeVisible();
  await expect(choiceDialog.getByRole("img", { name: "Industrial Assembly" })).toBeVisible();
  await sketchyRipper.hover();
  await expect(page.getByTestId("card-inspector-popover")).toHaveAttribute(
    "aria-label",
    "Sketchy Ripper inspection",
  );
  await expect(
    page.locator('[data-testid="reveal-destination-option"][data-destination="hand"]'),
  ).toBeVisible();
  await expect(
    page.locator('[data-testid="reveal-destination-option"][data-destination="trash"]'),
  ).toBeVisible();
  await page.locator('[data-testid="reveal-destination-option"][data-destination="trash"]').click();

  await expect(page.locator('[data-testid="event-log"]')).toContainText(
    "Revealed the top 2 cards of the deck: Sketchy Ripper, Industrial Assembly.",
  );
  await expect(page.locator('[data-testid="event-log"]')).toContainText(
    "Rival chose trash: moved 2 revealed card(s) to trash.",
  );
  await expect(page.locator('[data-testid="event-log"]')).toContainText("Fool on the Hill drew");
  await expect(
    page.locator('[data-testid="deck-zone"][data-side="player"] [data-testid="deck-reveal-shelf"]'),
  ).toHaveCount(0);
  expectEqual(
    "Fool on the Hill resolved choice",
    await pom.getPendingChoiceType(CYBERPUNK_P1),
    null,
  );
  await pom.getCardInZoneByDefinitionId(
    "trash",
    CYBERPUNK_P1,
    welcomeToNightCityRetailFoolOnTheHill.id,
  );
  await pom.getCardInZoneByDefinitionId(
    "trash",
    CYBERPUNK_P1,
    welcomeToNightCityRetailSketchyRipper.id,
  );
  await pom.getCardInZoneByDefinitionId(
    "trash",
    CYBERPUNK_P1,
    welcomeToNightCityRetailIndustrialAssembly.id,
  );
  await pom.getCardInZoneByDefinitionId(
    "hand",
    CYBERPUNK_P1,
    welcomeToNightCityRetailPeaceOffering.id,
  );
  await pom.expectStructuralState();
});

test("Fool on the Hill - AI rival resolves revealed cards destination", async ({ page }) => {
  await page.goto("/cyberpunk/simulator/tests/retailProgramTargetBench");
  const pom = await createPlaywrightCyberpunkSimulatorPom(page);

  const program = await pom.getCardInZoneByDefinitionId(
    "hand",
    CYBERPUNK_P1,
    welcomeToNightCityRetailFoolOnTheHill.id,
  );

  await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);

  const aiPanel = page.locator('[data-testid="ai-control-panel"]');
  await expect(aiPanel).toContainText("resolveRevealDestination");
  await expect(aiPanel).not.toContainText("Error");
  await expect(page.locator('[data-testid="event-log"]')).toContainText(
    "Revealed the top 2 cards of the deck: Sketchy Ripper, Industrial Assembly.",
  );
  await expect(page.locator('[data-testid="event-log"]')).toContainText(
    "Rival chose trash: moved 2 revealed card(s) to trash.",
  );
  await expect(page.locator('[data-testid="event-log"]')).toContainText("Fool on the Hill drew");
  await pom.getCardInZoneByDefinitionId(
    "trash",
    CYBERPUNK_P1,
    welcomeToNightCityRetailSketchyRipper.id,
  );
  await pom.getCardInZoneByDefinitionId(
    "trash",
    CYBERPUNK_P1,
    welcomeToNightCityRetailIndustrialAssembly.id,
  );
  await pom.expectStructuralState();
});
