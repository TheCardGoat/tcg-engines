import { expect, test } from "@playwright/test";
import { DEFAULT_GUNDAM_AUTOMATED_ACTION_STRATEGY_ID } from "@tcg/gundam-engine";

test.describe("Gundam · Zeta Shield assault", () => {
  test("auto-passes after the Shield attack and the readied Unit attack", async ({ page }) => {
    await page.goto("/gundam/simulator/tests/st10-shield-assault-lab");
    await expect(page.getByText("Loading match", { exact: true })).toHaveCount(0, {
      timeout: 15_000,
    });

    await page.getByRole("button", { name: "Bot controls", exact: true }).click();
    const aiPanel = page.getByTestId("ai-control-panel");
    await expect(aiPanel).toHaveAttribute(
      "data-strategy-id",
      DEFAULT_GUNDAM_AUTOMATED_ACTION_STRATEGY_ID,
    );
    await expect(aiPanel).toHaveAttribute("data-mode", "auto");
    await page.getByTestId("ai-strategy").selectOption("tempo");
    await expect(aiPanel).toHaveAttribute("data-strategy-id", "tempo");
    await page.getByRole("button", { name: "Bot controls", exact: true }).click();

    const readyZeta = page.getByRole("button", {
      name: /Zeta Gundam \(EX\), action available/i,
    });
    await expect(readyZeta).toBeVisible();
    await readyZeta.click();
    await page.getByRole("menuitem", { name: /Attack player/i }).click();

    await expect(page.getByText("Zeta Gundam (EX) was readied.", { exact: true })).toBeVisible();
    await expect(readyZeta).toBeVisible();

    await readyZeta.click();
    await page.getByRole("menuitem", { name: /Attack a Unit/i }).click();
    await page.getByRole("button", { name: "Attack Gouf" }).click();

    await expect(page.getByText("Gouf was defeated.", { exact: true })).toBeVisible();
    await expect(page.getByText("Combat resolved.", { exact: true })).toHaveCount(2);
    await expect(
      page.getByText("You passed the action window automatically (no actions available).", {
        exact: true,
      }),
    ).toHaveCount(2);
    await expect(page.getByRole("button", { name: "PASS ACTION" })).toHaveCount(0);
  });

  test.describe("mobile Unit targeting", () => {
    test.use({ hasTouch: true, viewport: { width: 390, height: 844 } });

    test("keeps the attack target on the battlefield without a duplicate prompt", async ({
      page,
    }) => {
      await page.goto("/gundam/simulator/tests/st10-shield-assault-lab?ai=off");
      await expect(page.getByText("Loading match", { exact: true })).toHaveCount(0, {
        timeout: 15_000,
      });

      await page.getByRole("button", { name: /Zeta Gundam \(EX\), action available/i }).tap();
      await page.getByRole("menuitem", { name: /Attack a Unit/i }).tap();

      await expect(page.getByTestId("attack-unit-targeting-instruction")).toBeVisible();
      await expect(page.getByTestId("interaction-resolution-prompt")).toHaveCount(0);
      await expect(page.getByRole("button", { name: "direct" })).toHaveCount(0);

      await page.getByRole("button", { name: "Attack Gouf" }).tap();
      await expect(page.getByTestId("attack-unit-targeting-instruction")).toHaveCount(0);
      await expect(
        page.getByLabel(/Zeta Gundam \(EX\), unit, blue, AP 5, HP 5, rested/i),
      ).toBeVisible();
    });
  });
});
