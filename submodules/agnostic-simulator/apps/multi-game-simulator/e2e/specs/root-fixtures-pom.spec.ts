import { test } from "@playwright/test";

import { createPlaywrightCyberpunkSimulatorPom } from "../poms/CyberpunkPlaywrightHarnessClient";
import { ROOT_FIXTURE_SCENARIO_CASES } from "../../src/games/cyberpunk/testing/root-fixture-scenarios";

test.describe("Cyberpunk root fixture POM smoke", () => {
  for (const scenario of ROOT_FIXTURE_SCENARIO_CASES) {
    test(`${scenario.name} exposes structural state through Playwright`, async ({ page }) => {
      await page.goto(`/cyberpunk/simulator/tests/${scenario.id}?ai=off`);

      const pom = createPlaywrightCyberpunkSimulatorPom(page);
      await pom.waitForReady();
      await pom.expectStructuralState();
    });
  }
});
