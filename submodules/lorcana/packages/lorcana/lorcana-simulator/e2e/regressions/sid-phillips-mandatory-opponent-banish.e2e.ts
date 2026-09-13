import { expect, LorcanaSimulatorPom, test } from "../support/lorcana-test.js";
import { sidPhillipsToySurgeonRegression } from "../../src/lib/features/simulator-devtools/fixtures/regressions/2026-05-08/sid-phillips-toy-surgeon.js";

test.describe("Sid Phillips - Toy Surgeon player report", () => {
  test("does not let the opponent skip their mandatory banish", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({ fixture: sidPhillipsToySurgeonRegression, view: "playerOne" });

    await page.getByLabel(/Sid Phillips - Toy Surgeon, cost 6/i).first().click();
    await page.getByRole("menuitem", { name: "Play: 6 ink" }).click();
    await page.getByRole("button", { name: "Open target selector" }).click();

    const targetDialog = page.locator(".card-target-dialog");
    await expect(targetDialog).toBeVisible();
    await targetDialog
      .getByRole("button", { name: "Toggle selection for Woody - Waiting for a Friend" })
      .click();

    await page.getByRole("button", { name: "Take Control" }).click();
    await page.getByRole("button", { name: "Open target selector" }).click();
    await expect(targetDialog).toBeVisible();
    await expect(targetDialog.getByRole("button", { name: "Skip effect" })).toHaveCount(0);
    await targetDialog
      .getByRole("button", { name: "Toggle selection for Simba - Protective Cub" })
      .click();

    await expect(page.getByRole("region", { name: "Event log" })).toContainText(
      "Simba - Protective Cub was banished",
    );
    await expect(page.getByRole("button", { name: "Open target selector" })).toHaveCount(0);
  });
});
