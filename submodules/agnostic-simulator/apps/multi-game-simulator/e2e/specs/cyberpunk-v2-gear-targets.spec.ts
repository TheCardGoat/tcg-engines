import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1440, height: 900 } });

test("V2 gear drag shows a rim on legal Legends and attaches on drop", async ({
  page,
}, testInfo) => {
  await page.addInitScript(() => {
    localStorage.setItem("tcg:cyberpunk:payment-selection-discovery:v1", "dismissed");
  });
  await page.goto(
    "/cyberpunk/simulator/tests/gearAttachToGoSoloLegend?ui=v2&ai=off&auto-advance-attack=off",
  );
  // The V1 POM requires its per-seat game-board wrappers. V2 has one board.
  const board = page.getByTestId("cyberpunk-board-v2");
  const source = board.locator('[data-testid="card"][data-zone="p-hand"]').filter({
    has: page.getByRole("img", { name: "Mantis Blades", exact: true }),
  });
  const target = board.locator('[data-testid="card"][data-zone="p-legendArea"]').filter({
    has: page.getByRole("img", { name: "Goro Takemura: Hands Unclean", exact: true }),
  });
  const rivalRack = board.locator('[data-v2-legend-rack="rival"]');
  await expect(rivalRack.getByTestId("card")).toHaveCount(1);
  await expect(target).not.toHaveAttribute("data-drop-hint", "attachGear");
  await expect(source).toBeVisible();
  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();
  if (!sourceBox || !targetBox) throw new Error("Gear or Legend is not visible");
  await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
  await page.mouse.down();
  try {
    await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y - 40, { steps: 8 });
    await expect(target).toHaveAttribute("data-drop-hint", "attachGear");
    await expect(target).toHaveAttribute("data-interaction-appearance", "target");
    await expect(rivalRack.locator('[data-drop-hint="attachGear"]')).toHaveCount(0);
    await page.screenshot({ path: testInfo.outputPath("gear-legend-target.png") });
    const rim = await target.locator("[data-sim-animation-face-target]").evaluate((face) => {
      const style = getComputedStyle(face, "::after");
      return {
        content: style.content,
        position: style.position,
        color: style.borderTopColor,
        width: style.borderTopWidth,
      };
    });
    expect(rim).toEqual({
      content: '""',
      position: "absolute",
      color: "rgb(245, 230, 66)",
      width: "2px",
    });
    await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, {
      steps: 12,
    });
  } finally {
    await page.mouse.up();
  }
  await expect(target).toHaveAttribute("data-gear-count", "1");
  await expect(board.locator('[data-testid="card"][data-zone="p-hand"]')).toHaveCount(0);
  await expect(target.getByTestId("attached-gear")).toHaveCount(1);
  await expect(target.getByRole("img", { name: "Mantis Blades", exact: true })).toBeVisible();
  await expect(target).not.toHaveAttribute("data-drop-hint", "attachGear");
});
