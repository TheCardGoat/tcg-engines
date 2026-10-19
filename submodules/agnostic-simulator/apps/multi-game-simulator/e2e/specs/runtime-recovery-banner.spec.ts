import { expect, test } from "@playwright/test";

// Presentation fixture: engine migration and hosted event handling are covered
// by snapshot-compatibility.test.ts and LiveMatch.page.test.tsx respectively.
test("shows an actionable recovery message without hiding the board", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/simulator-ui-fixtures/connection-clocks?recovery=game_state_incompatible");
  const alert = page.getByRole("alert");
  await expect(alert).toContainText("Game update required");
  await expect(alert).toContainText("A server update is needed");
  await expect(alert).toContainText("Support reference:");
  await expect(page.getByRole("region", { name: "Fixture playfield" })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("recovery-message.png"), fullPage: true });
  await page.getByRole("button", { name: "Retry board refresh" }).click();
  await expect(alert).toContainText("Board refreshed");
  await expect(alert).toContainText("No action was sent again automatically");
  await expect(page.getByRole("button", { name: "Retry board refresh" })).toHaveCount(0);
});
