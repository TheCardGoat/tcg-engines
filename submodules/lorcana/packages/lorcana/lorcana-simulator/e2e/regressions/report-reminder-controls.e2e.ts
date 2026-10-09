import {
  expect,
  test,
  buildRegressionFixturePath,
  LorcanaSimulatorPom,
} from "../support/lorcana-test.js";

const REMINDER_PATH = `${buildRegressionFixturePath("bug-19-max-goof-chart-topper", {
  view: "playerOne",
})}&supportReminder=1`;

for (const mobile of [false, true]) {
  test(`pointer reminder and shortcut open the report form (${mobile ? "mobile" : "desktop"})`, async ({
    page,
  }) => {
    await page.setViewportSize(mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 });
    const pom = new LorcanaSimulatorPom(page);
    await pom.gotoPath(REMINDER_PATH);

    const openForm = async () => {
      if (mobile) {
        await expect(page.getByRole("heading", { name: "Support", exact: true })).toBeVisible();
        await page
          .getByRole("button", { name: /^Report a bug Send a simulator bug report/ })
          .click();
      }
      const dialog = page.getByRole("dialog").filter({
        has: page.getByRole("heading", { name: "Report a bug", exact: true }),
      });
      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole("textbox")).toBeVisible();
      return dialog;
    };

    await page.getByRole("button", { name: "Report a bug", exact: true }).click();
    const reminderForm = await openForm();
    await reminderForm.getByRole("button", { name: "Close game settings", exact: true }).click();
    await expect(reminderForm).not.toBeVisible();

    // Exercise the shortcut with its real reminder still mounted after the reminder closes.
    await page
      .getByRole("button", { name: "Open bug report and feedback options", exact: true })
      .click();
    const shortcutForm = await openForm();
    await shortcutForm.getByRole("button", { name: "Close game settings", exact: true }).click();
    await expect(shortcutForm).not.toBeVisible();
    await page
      .getByRole("button", { name: "Open bug report and feedback options", exact: true })
      .press("Enter");
    await openForm();
  });
}
