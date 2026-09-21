import { buildRegressionFixturePath, expect, test } from "../support/lorcana-test.js";

test.describe("timer device clock skew", () => {
  for (const offsetHours of [-1, 1]) {
    test(`keeps the countdown stable after a ${offsetHours} hour wall-clock change`, async ({
      page,
    }, testInfo) => {
      const now = new Date();
      await page.clock.install({ time: now });
      await page.goto(buildRegressionFixturePath("timer-device-clock-skew", { view: "playerTwo" }));
      const activeTimer = page.getByRole("timer").first();
      await expect(activeTimer).toBeVisible();
      await expect(activeTimer).toHaveAttribute("aria-label", /Player time remaining: 2:[23]\d/);

      await page.clock.setSystemTime(new Date(now.getTime() + offsetHours * 3_600_000));
      await page.clock.runFor(2_000);

      await expect(activeTimer).toHaveAttribute("aria-label", /Player time remaining: 2:2\d/);
      await expect(page.getByRole("button", { name: /drop opponent/i })).toHaveCount(0);
      await expect(page.getByRole("button", { name: "Skip Their Turn" })).toHaveCount(0);
      await testInfo.attach("healthy-clock-after-skew", {
        body: await page.screenshot(),
        contentType: "image/png",
      });

      // Reserve expiry alone is not droppable during the server-configured grace.
      await page.clock.fastForward(158_000);
      await expect(activeTimer).toHaveAttribute("aria-label", /Player time remaining: -0:/);
      await expect(page.getByRole("button", { name: /drop opponent/i })).toHaveCount(0);
      await testInfo.attach("negative-clock-during-grace", {
        body: await page.screenshot(),
        contentType: "image/png",
      });

      // Once grace expires, the UI and server agree that Drop is legal.
      await page.clock.fastForward(15_000);
      await page.getByRole("button", { name: "Drop Opponent", exact: true }).click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await testInfo.attach("drop-after-grace", {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    });
  }
});
