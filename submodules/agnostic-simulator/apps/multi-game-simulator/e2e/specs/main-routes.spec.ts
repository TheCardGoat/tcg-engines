import { test, expect } from "../fixtures/test";
import {
  ROOT_FIXTURE_SCENARIO_CASES,
  ROOT_FIXTURE_SCENARIO_IDS,
} from "../../src/games/cyberpunk/testing/root-fixture-scenarios";

test.describe("main page route coverage", () => {
  test("home exposes every root fixture scenario from the shared list", async ({ page }) => {
    await page.goto("/cyberpunk/simulator/");
    await expect(page.getByRole("heading", { name: "Pick a board state" })).toBeVisible();

    for (const scenarioId of ROOT_FIXTURE_SCENARIO_IDS) {
      await expect(page.locator(`a[href="/cyberpunk/simulator/tests/${scenarioId}"]`)).toHaveCount(
        1,
      );
    }
  });

  test("opens a fixture route from the main page", async ({ page }) => {
    const scenario = ROOT_FIXTURE_SCENARIO_CASES[0];
    if (!scenario) {
      throw new Error("Expected at least one root fixture scenario.");
    }

    await page.goto("/cyberpunk/simulator/");
    const route = page.locator(`a[href="/cyberpunk/simulator/tests/${scenario.id}"]`);
    await expect(route).toBeVisible();
    await route.click();

    await expect(page).toHaveURL(
      new RegExp(`/cyberpunk/simulator/tests/${scenario.id}(?:\\?ai=off)?$`),
    );
    await expect(page.locator('[data-testid="game-board"][data-side="player"]')).toBeVisible();
    await expect(page.locator('[data-testid="game-board"][data-side="opponent"]')).toBeVisible();
    await expect(page.locator('[data-testid="pinfo-zone"]').first()).toBeVisible();
  });

  test("opens footer routes reachable from the main page", async ({ page }) => {
    await page.goto("/cyberpunk/simulator/");

    await page.locator('a[href="/cyberpunk/simulator/practice"]').click();
    await expect(page.getByRole("heading", { name: "Practice match" })).toBeVisible();

    await page.goto("/cyberpunk/simulator/matchmaking");
    await expect(page.getByRole("heading", { name: "Find a game" })).toBeVisible();
    await page.getByRole("link", { name: "Open practice" }).click();
    await expect(page.getByRole("heading", { name: "Practice match" })).toBeVisible();

    await page.goto("/cyberpunk/simulator/");
    await page.locator('a[href="/cyberpunk/simulator/tests"]').click();
    await expect(
      page.getByRole("heading", { name: "Cyberpunk simulator · fixture routes" }),
    ).toBeVisible();
  });
});
