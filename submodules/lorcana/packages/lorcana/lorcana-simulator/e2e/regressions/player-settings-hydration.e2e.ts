import { expect, test } from "../support/lorcana-test.js";

test("keeps a player setting changed after server hydration", async ({ page }) => {
  await page.goto("/tests/empty-board");

  await page.getByRole("button", { name: "Open game settings" }).click();

  const animationSpeed = page.locator("#player-animation-speed-select");
  await animationSpeed.selectOption("fast");

  await expect(animationSpeed).toHaveValue("fast");
});
