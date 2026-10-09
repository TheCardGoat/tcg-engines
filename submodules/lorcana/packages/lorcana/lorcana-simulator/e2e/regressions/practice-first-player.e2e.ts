import { expect, test } from "../support/lorcana-test.js";

for (const choice of ["You", "Opponent"]) {
  test(`practice accepts the first-player choice: ${choice}`, async ({ page }) => {
    const baseUrl = process.env.LORCANA_E2E_BASE_URL?.replace(/\/$/, "") ?? "";
    await page.goto(`${baseUrl}/sandbox/simulator/vs-ai`);
    await page.getByRole("button", { name: "Start match", exact: true }).click();
    await page.getByRole("button", { name: "Skip", exact: true }).click();
    await page.getByRole("button", { name: choice, exact: true }).click();
    await expect(page.getByRole("button", { name: "Keep hand", exact: true })).toBeVisible({
      timeout: 15_000,
    });
    await page.getByRole("button", { name: "Keep hand", exact: true }).click();
    await expect(page.getByRole("button", { name: "Pass Turn", exact: true })).toBeEnabled({
      timeout: 15_000,
    });
    await expect(
      page.getByText("That move cannot be executed right now.", { exact: true }),
    ).toHaveCount(0);
  });
}
