import { describe, test } from "vite-plus/test";
import { fireEvent, waitFor } from "@testing-library/react";
import {
  welcomeToNightCityRetailSaulBrightStormrider,
  welcomeToNightCityRetailSecondhandBombus,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Saul Bright - Stormrider (Retail) jsdom happy path", () => {
  test("submits zero end-turn ready targets from the board prompt", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "unitSaulBrightStormriderRetail" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const spentUnit = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailSecondhandBombus.id,
      );
      await pom.expectFieldCardSpent(CYBERPUNK_P1, spentUnit.instanceId, true);
      await pom.harness.dispatchEngine((engine) => engine.completeTurn({ as: CYBERPUNK_P1 }));
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

      const count = await waitFor(() => {
        const value = view.container.querySelector<HTMLElement>(
          '[data-testid="prompt-target-selection-count"]',
        );
        if (!value) {
          throw new Error("Expected zero-target staged count to render in the prompt banner.");
        }
        return value;
      });
      expectEqual("Saul zero-target staged count", count.textContent, "0/3");

      const confirm = view.container.querySelector<HTMLButtonElement>(
        '[data-testid="prompt-target-confirm"]',
      );
      if (!confirm) {
        throw new Error("Expected Saul's zero-target selection to have a Confirm button.");
      }
      expectEqual("Saul zero-target confirm enabled", confirm.disabled, false);
      fireEvent.click(confirm);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectFieldCardSpent(CYBERPUNK_P1, spentUnit.instanceId, true);
      expectEqual(
        "Saul passes priority after choosing zero Units",
        await pom.getActivePlayerId(),
        CYBERPUNK_P2,
      );
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });

  test("submits a partial up-to-3 end-turn ready target selection from the board", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "unitSaulBrightStormriderRetail" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailSaulBrightStormrider.id,
      );
      const spentUnit = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailSecondhandBombus.id,
      );
      await pom.expectFieldCardSpent(CYBERPUNK_P1, spentUnit.instanceId, true);

      await pom.harness.dispatchEngine((engine) => engine.completeTurn({ as: CYBERPUNK_P1 }));
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

      const spentUnitElement = view.container.querySelector<HTMLElement>(
        `[data-testid="field-unit"][data-card-id="${spentUnit.instanceId}"] [data-choice-eligible="true"]`,
      );
      if (!spentUnitElement) {
        throw new Error("Expected Saul's spent friendly Unit target to be visible on the board.");
      }
      fireEvent.click(spentUnitElement);

      const count = await waitFor(() => {
        const value = view.container.querySelector<HTMLElement>(
          '[data-testid="prompt-target-selection-count"]',
        );
        if (!value) {
          throw new Error("Expected staged target count to render in the prompt banner.");
        }
        if (value.textContent !== "1/3") {
          throw new Error(
            `Expected staged target count to update to 1/3, got ${value.textContent}`,
          );
        }
        return value;
      });
      expectEqual("Saul staged target count", count.textContent, "1/3");

      const confirm = view.container.querySelector<HTMLButtonElement>(
        '[data-testid="prompt-target-confirm"]',
      );
      if (!confirm) {
        throw new Error("Expected Saul's staged target selection to have a Confirm button.");
      }
      expectEqual("Saul confirm enabled", confirm.disabled, false);
      fireEvent.click(confirm);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectFieldCardSpent(CYBERPUNK_P1, spentUnit.instanceId, false);
      expectEqual(
        "Saul passes priority after readying Units",
        await pom.getActivePlayerId(),
        CYBERPUNK_P2,
      );
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
