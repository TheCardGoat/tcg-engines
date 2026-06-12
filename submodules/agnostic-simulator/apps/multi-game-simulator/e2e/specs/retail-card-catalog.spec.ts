import {
  boxToppersRetailCards,
  theHeistRetailStarterDeckCards,
  welcomeToNightCityRetailCards,
} from "@tcg/cyberpunk-cards";
import { test, expect } from "../fixtures/test";

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

test("retailCardCatalog renders every official retail card", async ({ simulator }) => {
  const pageErrors: string[] = [];
  simulator.page.on("pageerror", (error) => pageErrors.push(error.message));
  try {
    await simulator.gotoFixture("retailCardCatalog");
  } catch (error) {
    throw new Error(
      `retailCardCatalog failed to mount: ${pageErrors.join(" | ") || String(error)}`,
    );
  }
  const player = await simulator.getActivePlayerId();
  const mountedDefinitionIds = new Set([
    ...(await simulator.getTrashDefinitionIds(player)),
    ...(await simulator.getLegendAreaDefinitionIds(player)),
  ]);

  expect(retailCards).toHaveLength(34);
  await expect(simulator.playerBoard.trashZone).toHaveAttribute(
    "data-count",
    String(nonLegendRetailCards.length),
  );

  for (const card of mountedRetailCards) {
    expect(mountedDefinitionIds.has(card.id), `${card.displayName} is present in engine`).toBe(
      true,
    );
  }

  await expect(simulator.playerBoard.trashZone.locator('[data-testid="trash-card"]')).toBeVisible();
});
