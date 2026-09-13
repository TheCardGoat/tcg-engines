import {
  buildRegressionFixturePath,
  expect,
  test,
  LorcanaSimulatorPom,
} from "../support/lorcana-test.js";

test.describe("discard target picker", () => {
  test("Kristoff completes its single-card selection instead of getting stuck", async ({
    page,
  }, testInfo) => {
    await page.goto(
      buildRegressionFixturePath("bug-43-kristoff-icy-explorer", { view: "playerOne" }),
    );
    await page
      .getByLabel(/Kristoff - Icy Explorer, cost 4/i)
      .first()
      .click();
    await page.getByRole("menuitem", { name: "Play: 4 ink", exact: true }).click();
    const dialog = page.locator(".card-target-dialog");
    const olaf = dialog.locator(
      'button[aria-label="Toggle selection for Olaf - Carrot Enthusiast"]',
    );
    await olaf.click();
    // The default single-target flow auto-confirms once validation succeeds.
    await expect(dialog).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Open target selector" })).toHaveCount(0);
    const pom = new LorcanaSimulatorPom(page);
    await expect.poll(async () => (await pom.getStatus()).zoneCounts.player_two?.discard).toBe(1);
    await expect
      .poll(async () => (await pom.getBoard("playerOne")).players.player_two?.deckCount)
      .toBe(2);
    await testInfo.attach("kristoff-resolved", {
      body: await page.screenshot({ path: testInfo.outputPath("kristoff-resolved.png") }),
      contentType: "image/png",
    });
  });

  test("Taran keeps selected cards visible, supports deselection, and restricts the second card to the same owner", async ({
    page,
  }, testInfo) => {
    await page.goto(buildRegressionFixturePath("taran-discard-picker", { view: "playerOne" }));
    await page
      .getByLabel(/Taran - Magically Armed, cost 5/i)
      .first()
      .click();
    await page.getByRole("menuitem", { name: "Play: 5 ink", exact: true }).click();
    const dialog = page.locator(".card-target-dialog");
    const donald = dialog.locator(
      'button[aria-label="Toggle selection for Donald Duck - Strutting His Stuff"]',
    );
    const tala = dialog.locator(
      'button[aria-label="Toggle selection for Gramma Tala - Storyteller"]',
    );
    const olaf = dialog.locator(
      'button[aria-label="Toggle selection for Olaf - Carrot Enthusiast"]',
    );
    await donald.click();
    await expect(dialog).toContainText("1 selected");
    await expect(donald).toHaveAttribute("aria-pressed", "true");
    await expect(olaf).toHaveCount(0);
    await donald.click();
    await expect(dialog).toContainText("0 selected");
    await expect(olaf).toBeVisible();
    await tala.click();
    await donald.click();
    await expect(dialog).toContainText("2 selected");
    await expect(tala).toHaveAttribute("aria-pressed", "true");
    await expect(donald).toHaveAttribute("aria-pressed", "true");
    const confirm = dialog.locator("button").filter({ hasText: /^Confirm$/ });
    await expect(confirm).toBeEnabled();
    await testInfo.attach("taran-selection", {
      body: await page.screenshot({ path: testInfo.outputPath("taran-selection.png") }),
      contentType: "image/png",
    });
    await confirm.click();
    await expect(dialog).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Open target selector" })).toHaveCount(0);
    const pom = new LorcanaSimulatorPom(page);
    await expect.poll(async () => (await pom.getStatus()).zoneCounts.player_one?.discard).toBe(0);
    await expect(page.getByLabel("Deck cards: 7", { exact: true })).toBeVisible();
    await expect.poll(async () => (await pom.getStatus()).zoneCounts.player_two?.discard).toBe(1);
  });
});
