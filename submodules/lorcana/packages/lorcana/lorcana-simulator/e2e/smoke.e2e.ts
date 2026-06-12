import { expect, test, LorcanaSimulatorPom } from "./support/lorcana-test.js";

test("smoke: simulator harness boots and reports a status", async ({ page }) => {
  const pom = new LorcanaSimulatorPom(page);
  await pom.goto({ fixtureId: "pre-game", view: "playerOne" });

  const status = await pom.getStatus();
  expect(status).toBeDefined();
});
