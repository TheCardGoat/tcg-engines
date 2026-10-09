import { expect, test } from "@playwright/test";

test("shows the overtime result on the Cyberpunk post-game screen", async ({ page }) => {
  await page.goto("/cyberpunk/simulator/tests/endgame-preview");

  const modal = page.getByTestId("end-game-modal-fixture");
  await expect(modal).toBeVisible();
  await expect(modal).toHaveAttribute("data-end-reason", "overtime_majority");
  await expect(modal.getByText("Overtime: first to 7 Gig dice")).toBeVisible();
  await expect(modal.getByText("Turn 14")).toBeVisible();
});
