import {
  buildRegressionFixturePath,
  expect,
  LorcanaSimulatorPom,
  test,
} from "../support/lorcana-test.js";

test.describe("item presentation", () => {
  test("desktop renders opponent items in the regular play area without tucking their hand", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.gotoPath(buildRegressionFixturePath("feedback-ui-legibility", { view: "playerOne" }));

    const opponentPlayArea = page.getByRole("region", { name: "Play for Player Two" });

    await expect(
      opponentPlayArea.getByLabel("Fishbone Quill, cost 3", { exact: true }),
    ).toBeVisible();
    await expect(page.getByTestId("item-scroll-container-playerTwo")).toHaveCount(0);
    await expect(page.locator('[data-hand-shell-side="playerTwo"]')).toHaveAttribute(
      "data-hand-tucked",
      "false",
    );
  });
});
