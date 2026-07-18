import {
  buildRegressionFixturePath,
  expect,
  LorcanaSimulatorPom,
  test,
} from "../support/lorcana-test.js";

test.describe("item zone pagination", () => {
  test("desktop item shelves expose page controls when the collection overflows", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.gotoPath(buildRegressionFixturePath("feedback-ui-legibility", { view: "playerOne" }));

    const container = page.getByTestId("item-scroll-container-playerOne");
    const next = page.getByTestId("item-scroll-right-playerOne");
    const previous = page.getByTestId("item-scroll-left-playerOne");
    const resizer = page.getByTestId("bar-zone-resizer-playerOne");

    await expect(container).toBeVisible();
    await expect(next).toBeVisible();
    await expect(previous).toBeDisabled();
    await expect(resizer).toHaveAttribute("data-current-split", "50");

    const [containerBox, previousBox, nextBox] = await Promise.all([
      container.boundingBox(),
      previous.boundingBox(),
      next.boundingBox(),
    ]);
    expect(containerBox).not.toBeNull();
    expect(previousBox).not.toBeNull();
    expect(nextBox).not.toBeNull();
    expect(previousBox!.x + previousBox!.width).toBeLessThanOrEqual(containerBox!.x);
    expect(nextBox!.x).toBeGreaterThanOrEqual(containerBox!.x + containerBox!.width);

    const widthBeforeResize = containerBox!.width;
    const resizerBox = await resizer.boundingBox();
    expect(resizerBox).not.toBeNull();
    await page.mouse.move(
      resizerBox!.x + resizerBox!.width / 2,
      resizerBox!.y + resizerBox!.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(resizerBox!.x + 500, resizerBox!.y + resizerBox!.height / 2);
    await page.mouse.up();
    await expect(resizer).toHaveAttribute("data-current-split", "70");
    await expect
      .poll(async () => (await container.boundingBox())?.width ?? 0)
      .toBeLessThan(widthBeforeResize);

    const initialScrollLeft = await container.evaluate((element) => element.scrollLeft);
    await next.click();
    await expect
      .poll(() => container.evaluate((element) => element.scrollLeft))
      .toBeGreaterThan(initialScrollLeft);
    await expect(previous).toBeEnabled();
  });
});
