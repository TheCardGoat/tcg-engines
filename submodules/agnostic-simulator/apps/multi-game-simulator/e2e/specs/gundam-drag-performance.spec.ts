import { expect, test, type Locator, type Page, type TestInfo } from "@playwright/test";

const DEPLOY_ROUTE = "/gundam/simulator/vs-ai?fixture=deploy-unit-demo";
const ATTACK_ROUTE = "/gundam/simulator/tests/st10-shield-assault-lab";

interface AutomationDragDuration {
  readonly automationPickupMs: number;
  readonly automationDragMs: number;
  readonly automationReleaseMs: number;
}

async function dragWithAutomationDurations(
  page: Page,
  source: Locator,
  target: Locator,
  visibleDragVisuals: Locator,
): Promise<AutomationDragDuration> {
  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();
  if (!sourceBox || !targetBox) throw new Error("Drag source and target must be visible");

  const sourcePoint = {
    x: sourceBox.x + sourceBox.width / 2,
    y: sourceBox.y + sourceBox.height / 2,
  };
  const targetPoint = {
    x: targetBox.x + targetBox.width / 2,
    y: targetBox.y + targetBox.height / 2,
  };

  await page.mouse.move(sourcePoint.x, sourcePoint.y);
  const pickupStarted = performance.now();
  await page.mouse.down();
  await page.mouse.move(sourcePoint.x + 8, sourcePoint.y + 8, { steps: 2 });
  await expect(visibleDragVisuals).toHaveCount(2);
  const automationPickupMs = performance.now() - pickupStarted;

  const dragStarted = performance.now();
  await page.mouse.move(targetPoint.x, targetPoint.y, { steps: 20 });
  const automationDragMs = performance.now() - dragStarted;

  const releaseStarted = performance.now();
  await page.mouse.up();
  const automationReleaseMs = performance.now() - releaseStarted;

  return { automationPickupMs, automationDragMs, automationReleaseMs };
}

async function attachAutomationDurations(
  testInfo: TestInfo,
  name: string,
  samples: readonly AutomationDragDuration[],
) {
  // These durations include Playwright transport, action scheduling, and
  // assertion polling. They help diagnose automation outliers, but renderer
  // frame latency and main-thread utilization belong in Firefox Profiler.
  await testInfo.attach(name, {
    body: JSON.stringify(samples, null, 2),
    contentType: "application/json",
  });
}

test.describe("Gundam drag regression and profiling smoke", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
  });

  test("accepts exactly one hand drop after an idle hold", async ({ page }, testInfo) => {
    await page.goto(DEPLOY_ROUTE);

    const gm = page.locator('img[alt="GM"]');
    const battleArea = page.locator('[aria-label="Your battle area drop zone"]');
    await expect(gm).toHaveCount(1, { timeout: 15_000 });
    await expect(battleArea).toBeVisible();

    await page.waitForTimeout(3_000);
    await expect(page.locator('img[alt="GM"]:visible')).toHaveCount(1);

    const sample = await dragWithAutomationDurations(
      page,
      gm,
      battleArea,
      page.locator('img[alt="GM"]:visible'),
    );
    await attachAutomationDurations(testInfo, "accepted-hand-drag-automation.json", [sample]);

    await expect(battleArea.locator('img[alt="GM"]')).toHaveCount(1, { timeout: 4_000 });
    await expect(page.locator('img[alt="GM"]:visible')).toHaveCount(1);
    await expect(page.locator("[data-animation-transfer-layer]")).toHaveCount(0);
    await expect(page.getByText("Deployed GM.", { exact: true })).toHaveCount(1);
  });

  test("returns an invalid hand drop without dispatching a deploy", async ({ page }, testInfo) => {
    await page.goto(DEPLOY_ROUTE);

    const gm = page.locator('img[alt="GM"]');
    const invalidTarget = page.getByRole("log", { name: "Comms log" });
    await expect(gm).toHaveCount(1, { timeout: 15_000 });
    await expect(invalidTarget).toBeVisible();

    const sample = await dragWithAutomationDurations(
      page,
      gm,
      invalidTarget,
      page.locator('img[alt="GM"]:visible'),
    );
    await attachAutomationDurations(testInfo, "invalid-hand-drag-automation.json", [sample]);

    await expect(
      page.locator('[aria-label="Your battle area drop zone"] img[alt="GM"]'),
    ).toHaveCount(0);
    await expect(page.locator('img[alt="GM"]:visible')).toHaveCount(1);
    await expect(page.locator("[data-animation-transfer-layer]")).toHaveCount(0);
    await expect(page.getByText("Deployed GM.", { exact: true })).toHaveCount(0);
  });

  test("moves only the attack overlay and dispatches one direct attack", async ({
    page,
  }, testInfo) => {
    await page.goto(ATTACK_ROUTE);

    const source = page.locator('[data-testid^="attack-drag-source-"]').first();
    await expect(source).toBeVisible({ timeout: 15_000 });

    const playerTarget = page.locator('[data-testid="attack-drop-target-player"]');
    const sourceBox = await source.boundingBox();
    if (!sourceBox) throw new Error("Attack source must be visible");
    await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
    const pickupStarted = performance.now();
    await page.mouse.down();
    await page.mouse.move(sourceBox.x + sourceBox.width / 2 + 8, sourceBox.y + 8, { steps: 2 });
    await expect(playerTarget).toBeVisible();
    const automationPickupMs = performance.now() - pickupStarted;
    const activeSourceBox = await source.boundingBox();
    expect(activeSourceBox).not.toBeNull();
    expect(activeSourceBox?.x).toBeCloseTo(sourceBox.x, 0);
    expect(activeSourceBox?.y).toBeCloseTo(sourceBox.y, 0);
    expect(await source.evaluate((element) => (element as HTMLElement).style.transform)).toBe("");

    const targetBox = await playerTarget.boundingBox();
    if (!targetBox) throw new Error("Direct attack target must be visible");
    const dragStarted = performance.now();
    await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, {
      steps: 20,
    });
    const automationDragMs = performance.now() - dragStarted;
    const releaseStarted = performance.now();
    await page.mouse.up();
    const sample = {
      automationPickupMs,
      automationDragMs,
      automationReleaseMs: performance.now() - releaseStarted,
    };
    await attachAutomationDurations(testInfo, "direct-attack-drag-automation.json", [sample]);

    await expect(page.getByText(/Attacked direct with Zeta Gundam \(EX\)/i)).toHaveCount(1);
    await expect(page.getByText("Combat resolved.", { exact: true })).toHaveCount(1);
  });
});
