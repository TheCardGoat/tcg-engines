import {
  boxToppersRetailCards,
  theHeistRetailStarterDeckCards,
  welcomeToNightCityRetailCards,
} from "@tcg/cyberpunk-cards";
import { test, expect } from "@playwright/test";
import { expectDomAttribute } from "@tcg/simulator-testing";
import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";

const retailCards = [
  ...boxToppersRetailCards,
  ...theHeistRetailStarterDeckCards,
  ...welcomeToNightCityRetailCards,
];
const nonLegendRetailCards = retailCards.filter((card) => card.type !== "legend");
const mountedRetailCards = [
  ...nonLegendRetailCards,
  ...retailCards.filter((card) => card.type === "legend").slice(0, 3),
];

test("retailCardCatalog renders every official retail card", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  const pom = await createPlaywrightCyberpunkSimulatorPom(page, {
    fixture: { scenarioId: "retailCardCatalog" },
  });

  if (pageErrors.length > 0) {
    throw new Error(`retailCardCatalog failed to mount: ${pageErrors.join(" | ")}`);
  }

  const player = await pom.getActivePlayerId();
  const trashCards = await pom.getCardsInZone("trash", player);
  const legendCards = await pom.getCardsInZone("legendArea", player);
  const mountedDefinitionIds = new Set([
    ...trashCards.map((card) => card.definitionId),
    ...legendCards.map((card) => card.definitionId),
  ]);

  expect(retailCards).toHaveLength(34);
  await expectDomAttribute(
    pom.playerBoard.trashZone(),
    "data-count",
    String(nonLegendRetailCards.length),
  );

  for (const card of mountedRetailCards) {
    expect(mountedDefinitionIds.has(card.id), `${card.displayName} is present in engine`).toBe(
      true,
    );
  }

  const renderedTrashCards = await pom.playerBoard
    .trashZone()
    .locator('[data-testid="card"]')
    .count();
  expect(renderedTrashCards).toBeGreaterThan(0);
});
