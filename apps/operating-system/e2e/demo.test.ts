import { expect, test } from "@playwright/test";

test("home page renders topbar search button", async ({ page }) => {
  await page.goto("/");

  const topbar = page.getByRole("navigation", { name: "Topbar" });
  await expect(
    topbar.getByRole("button", { name: "Open Command Center" }),
  ).toBeVisible();
});

test("restores open windows after reload", async ({ page }) => {
  await page.goto("/");

  const topbar = page.getByRole("navigation", { name: "Topbar" });

  await topbar.getByRole("button", { name: "Open Command Center" }).click();
  await page
    .getByRole("dialog", { name: "Command Center" })
    .getByRole("button", { name: /Hello World/ })
    .click();

  await expect(
    page.getByRole("heading", { name: "Hello World! 👋", level: 1 }),
  ).toBeVisible();

  await page.waitForFunction(() => {
    return (
      window.localStorage.getItem("tcg.operational-system.osState") !== null
    );
  });

  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Hello World! 👋", level: 1 }),
  ).toBeVisible();
});
