import { expect, test } from "@playwright/test";

for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test(`Gundam ${viewport.name} transfer remains readable and settles once`, async ({
    page,
  }, info) => {
    test.setTimeout(60_000);
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/gundam/simulator/vs-ai?fixture=deploy-unit-demo", {
      waitUntil: "domcontentloaded",
    });
    const gm = page.locator('img[alt="GM"]');
    await expect(gm).toHaveCount(1, { timeout: 30_000 });
    await expect
      .poll(() => gm.evaluate((image: HTMLImageElement) => image.naturalWidth), { timeout: 15_000 })
      .toBeGreaterThan(0);
    const sourceBounds = await gm.boundingBox();
    await page.screenshot({ path: info.outputPath(`${viewport.name}-start.png`) });
    await gm.click();
    await page.getByRole("menuitem", { name: /Deploy Unit/ }).click();
    await expect(page.locator('[aria-busy="true"]')).toBeAttached();
    await expect(page.locator("[data-animation-transfer-entity]")).toHaveCount(1);
    // Duplicate mobile resize events must not cancel the active transfer.
    await page.evaluate(() => window.dispatchEvent(new Event("resize")));
    // A genuine observation inside the 800ms movement, not a settled screenshot.
    await page.waitForTimeout(200);
    await expect
      .poll(() =>
        page
          .locator('[data-animation-transfer-entity] img[alt="GM"]')
          .evaluate((image: HTMLImageElement) => image.naturalWidth),
      )
      .toBeGreaterThan(0);
    await expect(page.locator('[aria-busy="true"]')).toBeAttached();
    const transferBounds = await page
      .locator('[data-animation-transfer-entity] img[alt="GM"]')
      .boundingBox();
    await page.screenshot({ path: info.outputPath(`${viewport.name}-active.png`) });
    await expect(page.locator('[aria-busy="true"]')).toHaveCount(0, { timeout: 6_000 });
    await expect(page.locator("[data-animation-transfer-layer]")).toHaveCount(0);
    await expect(gm).toHaveCount(1);
    await expect(
      page.locator('[aria-label="Your battle area drop zone"] img[alt="GM"]'),
    ).toHaveCount(1);
    const destinationBounds = await gm.boundingBox();
    expect(sourceBounds).not.toBeNull();
    expect(transferBounds).not.toBeNull();
    expect(destinationBounds).not.toBeNull();
    expect(transferBounds!.width).toBeLessThanOrEqual(
      Math.max(sourceBounds!.width, destinationBounds!.width) + 3,
    );
    await page.screenshot({ path: info.outputPath(`${viewport.name}-settled.png`) });
  });
}

test("Gundam reduced motion settles without a transfer overlay or blocked controls", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/gundam/simulator/vs-ai?fixture=deploy-unit-demo", {
    waitUntil: "domcontentloaded",
  });
  await page.locator('img[alt="GM"]').click();
  await page.getByRole("menuitem", { name: /Deploy Unit/ }).click();
  await expect(page.locator('[aria-label="Your battle area drop zone"] img[alt="GM"]')).toHaveCount(
    1,
  );
  await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
  await expect(page.locator("[data-animation-transfer-layer]")).toHaveCount(0);
});

test("Gundam command shows its effect before cleanup and releases controls", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/gundam/simulator/vs-ai?fixture=command-auto-resolve-demo", {
    waitUntil: "domcontentloaded",
  });
  await page.locator('img[alt="A Show of Resolve"]').click();
  await page.getByRole("menuitem", { name: /Play Command/ }).click();
  await expect(page.locator("[data-animation-transfer-layer]")).toBeAttached();
  await expect(page.getByText("COMMAND EFFECT", { exact: true })).toBeVisible();
  await expect(page.locator('[aria-busy="true"]')).toBeAttached();
  const focus = page.locator('[data-sim-anchor-id="gundam-command-focus"]');
  await expect(focus).toHaveAttribute("data-simulator-animation-suppressed", "true");
  await expect(page.locator("[data-animation-transfer-entity]")).toHaveCount(0);
  // The cleanup overlay has landed, but the reading pause still holds the board.
  await expect(page.locator('[aria-busy="true"]')).toBeAttached();
  await expect(focus).toHaveAttribute("data-simulator-animation-suppressed", "true");
  await expect(focus).toBeHidden();
  await expect(page.locator('[aria-busy="true"]')).toHaveCount(0, { timeout: 8_000 });
  await expect(page.locator("[data-animation-transfer-layer]")).toHaveCount(0);
  await expect(page.getByText("COMMAND EFFECT", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "PASS TURN", exact: true })).toBeEnabled();
});
