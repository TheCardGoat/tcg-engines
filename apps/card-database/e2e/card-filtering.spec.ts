import { expect, test } from "@playwright/test";

test.describe("Card Database", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for hydration/initialization to ensure listeners are attached
    await page.waitForTimeout(1000);
  });

  test("should display cards on initial load", async ({ page }) => {
    // Wait for cards to load
    await expect(page.getByText("Results")).toBeVisible();

    // Check for the "Lorcana Database" header
    await expect(
      page.getByRole("heading", { name: "Lorcana Database" }),
    ).toBeVisible();

    // Check internal count matches visual indication (approximate check usually, but here we can check text)
    const resultsText = await page
      .getByText(/Results \d+/, { exact: false })
      .textContent();
    // Expect "Results 1865" or similar number
    expect(resultsText).toMatch(/Results \d+/);
  });

  test("should filter by Ink", async ({ page }) => {
    const initialCountStr = await page.getByText(/Results \d+/).textContent();

    // Use test-id for reliable selection
    await page.getByTestId("filter-ink-ruby").click({ force: true });

    // Wait for list to update
    await expect(page.getByText(/Results \d+/)).not.toHaveText(
      initialCountStr || "",
    );

    const newCountStr = await page.getByText(/Results \d+/).textContent();
    const newCount = Number.parseInt(newCountStr?.split(" ")[1] || "0");

    expect(newCount).toBeLessThan(
      Number.parseInt(initialCountStr?.split(" ")[1] || "0"),
    );
    expect(newCount).toBeGreaterThan(0);
  });

  test("should filter by Cost", async ({ page }) => {
    // Click Cost '5'
    await page.getByTestId("filter-cost-5").click();

    const resultsText = await page.getByText(/Results \d+/).textContent();
    const count = Number.parseInt(resultsText?.split(" ")[1] || "0");

    expect(count).toBeGreaterThan(0);
  });

  test("should filter by Type", async ({ page }) => {
    // Click 'Character' checkbox
    await page.getByLabel("character").check();

    const resultsText = await page.getByText(/Results \d+/).textContent();
    const count = Number.parseInt(resultsText?.split(" ")[1] || "0");

    expect(count).toBeGreaterThan(0);
  });

  test("should search by text", async ({ page }) => {
    // Type 'Stitch' in search
    await page.getByPlaceholder("Search cards...").fill("Stitch");

    await expect(page.getByText(/Results \d+/)).toBeVisible();

    // Check that at least one result has "Stitch" visible
    await expect(
      page.locator(".group").filter({ hasText: "Stitch" }).first(),
    ).toBeVisible();
  });

  test("should support AND logic with multiple filters", async ({ page }) => {
    // Ruby + Cost 5
    await page.getByTestId("filter-ink-ruby").click({ force: true });
    await page.getByTestId("filter-cost-5").click();

    const resultsText = await page.getByText(/Results \d+/).textContent();
    const count = Number.parseInt(resultsText?.split(" ")[1] || "0");

    // 35 was the verified number in manual test
    expect(count).toBe(35);
  });

  test("should support OR logic", async ({ page }) => {
    // Switch to OR
    await page.getByRole("button", { name: "OR" }).click({ force: true });

    // Ruby OR Cost 5
    await page.getByTestId("filter-ink-ruby").click({ force: true });
    await page.getByTestId("filter-cost-5").click();

    const resultsText = await page.getByText(/Results \d+/).textContent();
    const count = Number.parseInt(resultsText?.split(" ")[1] || "0");

    expect(count).toBeGreaterThan(333);
  });

  test("should change image crop", async ({ page }) => {
    // Select 'Art Only' - target using test-id
    await page.getByTestId("crop-select").selectOption("art_only");

    await expect(page.getByTestId("crop-select")).toHaveValue("art_only");
  });
});
