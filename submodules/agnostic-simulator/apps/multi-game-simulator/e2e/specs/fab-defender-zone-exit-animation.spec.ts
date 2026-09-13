import { expect, test } from "@playwright/test";

const FIXTURE_ROUTE = "/flesh-and-blood/simulator/tests/defender-zone-exit";

test.describe("FAB defender zone-exit animation", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
  });

  test("moves Into the Muck and its defender through the complete combat lifecycle", async ({
    page,
  }) => {
    await page.goto(FIXTURE_ROUTE, { waitUntil: "domcontentloaded" });

    const defense = page.getByTestId("fab-chain-total-defense");
    const transfers = page.locator("[data-animation-transfer-entity]");
    const intoTheMuck = page.locator('img[alt="Into the Muck"]');
    const defender = page.getByTestId("fab-chain-blocks").locator('img[alt="Nimblism"]');
    await expect(intoTheMuck).toBeVisible({ timeout: 20_000 });
    await expect(defender).toBeVisible();
    await expect(defense).toContainText("2");

    await intoTheMuck.click();

    await expect(page.locator('[aria-busy="true"]')).toBeAttached({ timeout: 1_000 });
    await expect(page.locator("[data-animation-transfer-layer]")).toBeAttached({ timeout: 1_000 });
    await expect(transfers.locator('img[alt="Into the Muck"]')).toHaveCount(1);
    await expect(transfers.locator('img[alt="Nimblism"]')).toHaveCount(1);
    expect(
      await transfers.evaluateAll((cards) => cards.every((card) => card.style.transform)),
    ).toBe(true);
    await expect(defense).toContainText("2");

    await expect(page.locator("[data-animation-transfer-layer]")).toHaveCount(0, {
      timeout: 3_000,
    });
    await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
    await expect(defender).toHaveCount(0);
    await expect(defense).toContainText("0");
    await expect(page.getByRole("button", { name: "Inspect Banished, 1 card" })).toBeVisible();
    await expect(page.getByText("Practice bot banished Nimblism", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Close combat chain" }).click();
    await expect(page.getByRole("heading", { name: "COMBAT CHAIN" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Inspect Graveyard, 2 cards" })).toBeVisible();
  });

  test("crossfades the same exit without spatial motion when motion is reduced", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(FIXTURE_ROUTE, { waitUntil: "domcontentloaded" });

    const intoTheMuck = page.locator('img[alt="Into the Muck"]');
    await expect(intoTheMuck).toBeVisible({ timeout: 20_000 });
    await intoTheMuck.click();

    const transfers = page.locator("[data-animation-transfer-entity]");
    await expect(page.locator("[data-animation-transfer-layer]")).toBeAttached({ timeout: 1_000 });
    await expect(transfers.locator('img[alt="Into the Muck"]')).toHaveCount(2);
    await expect(transfers.locator('img[alt="Nimblism"]')).toHaveCount(2);
    expect(
      await transfers.evaluateAll((cards) =>
        cards.every((card) => getComputedStyle(card).transform === "none"),
      ),
    ).toBe(true);
    expect(
      await transfers.locator("[data-animation-reduced-source]").count(),
    ).toBeGreaterThanOrEqual(2);
    expect(
      await transfers.locator("[data-animation-reduced-destination]").count(),
    ).toBeGreaterThanOrEqual(2);
    await expect(page.getByTestId("fab-chain-total-defense")).toContainText("2");

    await expect(page.locator("[data-animation-transfer-layer]")).toHaveCount(0, {
      timeout: 1_000,
    });
    await expect(page.getByTestId("fab-chain-total-defense")).toContainText("0");
    await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
  });
});
