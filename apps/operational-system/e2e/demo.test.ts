import { expect, test } from "@playwright/test";

test("home page renders taskbar start button", async ({ page }) => {
  await page.goto("/");

  const taskbar = page.getByRole("navigation", { name: "Taskbar" });
  await expect(
    taskbar.getByRole("button", { name: "Open Command Center" }),
  ).toBeVisible();
});

test("restores open windows after reload", async ({ page }) => {
  await page.goto("/");

  const taskbar = page.getByRole("navigation", { name: "Taskbar" });

  await taskbar.getByRole("button", { name: "Open Command Center" }).click();
  await page
    .getByRole("dialog", { name: "Command Center" })
    .getByRole("button", { name: /Hello World/ })
    .click();

  await expect(
    taskbar.getByRole("button", { name: /Hello World/ }),
  ).toBeVisible();

  await page.waitForFunction(() => {
    return (
      window.localStorage.getItem("tcg.operational-system.osState") !== null
    );
  });

  await page.reload();
  await expect(
    taskbar.getByRole("button", { name: /Hello World/ }),
  ).toBeVisible();
});
