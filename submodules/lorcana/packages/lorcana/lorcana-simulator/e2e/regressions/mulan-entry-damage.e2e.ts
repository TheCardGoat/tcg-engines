import {
  expect,
  test,
  buildRegressionFixturePath,
  LorcanaSimulatorPom,
} from "../support/lorcana-test.js";

test("Mulan's self-only entry damage does not damage an opposing character", async ({
  page,
}, testInfo) => {
  const pom = new LorcanaSimulatorPom(page);
  await pom.gotoPath(buildRegressionFixturePath("mulan-entry-damage"));
  await page
    .getByRole("button", { name: "Mickey Mouse - Brave Little Tailor, cost 8", exact: true })
    .first()
    .click();
  await page.getByRole("menuitem", { name: "Play: 8 ink", exact: true }).click();

  const opposingMickey = page
    .getByRole("region", { name: "Play for Player One", exact: true })
    .getByRole("button", { name: "Mickey Mouse - Brave Little Tailor, cost 8", exact: true });
  await expect(opposingMickey).toBeVisible();
  await expect(opposingMickey).not.toContainText("-2");
  await expect(
    page
      .getByRole("region", { name: "Play for Player Two", exact: true })
      .getByRole("button", { name: "Mulan - Injured Soldier, cost 1", exact: true }),
  ).toContainText("-2");
  await expect
    .poll(async () =>
      opposingMickey
        .locator("img")
        .first()
        .evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0),
    )
    .toBe(true);
  const screenshotPath = testInfo.outputPath("mulan-entry-damage-fixed.png");
  await page.screenshot({ path: screenshotPath });
  await testInfo.attach("mulan-entry-damage-fixed", {
    path: screenshotPath,
    contentType: "image/png",
  });
});
