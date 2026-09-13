import { expect, test, buildRegressionFixturePath } from "../support/lorcana-test.js";
import type { Page } from "@playwright/test";

const FIXTURE_ID = "ward-hidden-zone-selection";
test.describe.configure({ mode: "serial" });

function recoveryPath(
  commandStatus: "submitting" | "recovering-stale" | "recovering-unknown" | "failed",
): string {
  const url = new URL(
    buildRegressionFixturePath(FIXTURE_ID, { view: "playerOne" }),
    "http://local",
  );
  url.searchParams.set("commandStatus", commandStatus);
  url.searchParams.set("chat", "1");
  return `${url.pathname}${url.search}`;
}

async function waitForHarness(page: Page): Promise<void> {
  await expect(page.getByTestId("lorcana-test-harness")).toBeVisible({ timeout: 30_000 });
}

test("locks gameplay and announces each command recovery phase", async ({ page }) => {
  await page.goto(recoveryPath("submitting"));
  await waitForHarness(page);
  await expect(page.getByTestId("authoritative-command-banner")).toContainText(
    "Confirming action…",
  );
  await expect(page.locator('[aria-busy="true"]')).toHaveCount(1);

  const stateIdBeforeKeyboardInput = await page.evaluate(() =>
    window.__lorcanaTestHarness?.getStatus("authoritative").then((status) => status.stateID),
  );
  await page.keyboard.press("Space");
  await page.waitForTimeout(100);
  const stateIdAfterKeyboardInput = await page.evaluate(() =>
    window.__lorcanaTestHarness?.getStatus("authoritative").then((status) => status.stateID),
  );
  expect(stateIdAfterKeyboardInput).toBe(stateIdBeforeKeyboardInput);

  await page.goto(recoveryPath("recovering-stale"));
  await waitForHarness(page);
  await expect(page.getByTestId("authoritative-command-banner")).toContainText(
    "The board changed. Updating your game…",
  );

  await page.goto(recoveryPath("recovering-unknown"));
  await waitForHarness(page);
  await expect(page.getByTestId("authoritative-command-banner")).toContainText(
    "Checking the latest game state…",
  );

  await page.goto(recoveryPath("failed"));
  await waitForHarness(page);
  const failure = page.getByTestId("authoritative-command-banner");
  await expect(failure).toContainText(
    "We couldn’t update the board. Check your connection and try again.",
  );
  await expect(failure.getByRole("button", { name: "Try again" })).toBeEnabled();

  const settingsButton = page.getByRole("button", { name: /settings/i }).first();
  await expect(settingsButton).toBeEnabled();
  await expect(page.locator("button.sidebar-chat-bubble")).toBeEnabled();
});

test("keeps failed recovery usable on a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(recoveryPath("failed"));
  await waitForHarness(page);

  const failure = page.getByTestId("authoritative-command-banner");
  await expect(failure).toBeVisible();
  const bounds = await failure.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(390);
  await expect(failure.getByRole("button", { name: "Try again" })).toBeEnabled();
  await expect(page.getByRole("button", { name: /settings/i }).first()).toBeEnabled();
});

test("shows recovered guidance once without exposing diagnostics", async ({ page }) => {
  const url = new URL(
    buildRegressionFixturePath(FIXTURE_ID, { view: "playerOne" }),
    "http://local",
  );
  url.searchParams.set("recovered", "1");
  await page.goto(`${url.pathname}${url.search}`);
  await waitForHarness(page);

  await expect(page.getByText("Board updated. Please choose your action again.")).toHaveCount(1);
  await expect(page.getByText(/expected version|could not load game state/i)).toHaveCount(0);
});
