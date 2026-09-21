import { describe, test } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorporateSurveillance,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
} from "@tcg/cyberpunk-cards";
import { fireEvent, waitFor } from "@testing-library/react";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";
import { WindowCyberpunkHarnessClient } from "@cyberpunk/testing/window-cyberpunk-harness-client";

describe("Alt Cunningham - Soulkiller Architect (Retail) jsdom happy path", () => {
  test("shows both activated abilities in the Contacts menu", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendAltCunninghamSoulkillerArchitectRetail",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const alt = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        welcomeToNightCityRetailAltCunninghamSoulkillerArchitect.id,
      );
      const altCard = view.container.querySelector<HTMLElement>(
        `[data-testid="card"][data-instance-id="${alt.instanceId}"]`,
      );
      if (!altCard) {
        throw new Error("Expected Alt Cunningham to be rendered on the board.");
      }
      fireEvent.click(altCard);

      let actions: HTMLButtonElement[] = [];
      await waitFor(() => {
        actions = [
          ...document.querySelectorAll<HTMLButtonElement>(
            '[data-testid="card-context-menu"] [data-action-id*="activateAbility"]',
          ),
        ];
        expectEqual("Alt Cunningham Contacts ability count", actions.length, 2);
      });
      expectEqual("Alt Cunningham Contacts ability count", actions.length, 2);
      expectEqual(
        "Alt Cunningham Contacts ability indexes",
        actions.map((action) => action.dataset.actionId?.split(":").at(-1) ?? "").join(","),
        "0,1",
      );
      expectEqual(
        "Alt discount ability uses printed text",
        actions[0]?.textContent?.includes(
          "Your next Program this turn plays for -1 €$ for each friendly min Gig",
        ),
        true,
      );
      expectEqual(
        "Alt trash-play ability uses printed text",
        actions[1]?.textContent?.includes("Play a Program from your trash"),
        true,
      );
    } finally {
      view.unmount();
    }
  });

  test("spends to play a Program from trash", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendAltCunninghamSoulkillerArchitectRetail",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const alt = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        welcomeToNightCityRetailAltCunninghamSoulkillerArchitect.id,
      );

      await pom.activateAbility(alt.instanceId, 1, CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      const spendEligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      expectEqual("trash Program eligible spend targets", spendEligible.length, 2);
      const corporateSurveillance = await pom.getCardInZoneByDefinitionId(
        "trash",
        CYBERPUNK_P1,
        welcomeToNightCityRetailCorporateSurveillance.id,
      );
      await pom.resolveEffectTarget([corporateSurveillance.instanceId], CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      const corpoSecurity = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        welcomeToNightCityRetailCorpoSecurity.id,
      );
      await pom.resolveEffectTarget([corpoSecurity.instanceId], CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectEddies(CYBERPUNK_P1, 5); // 8 - 1 (Alt) - 2 (Corporate Surveillance)
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });

  test("cancels an unaffordable trash Program and continues the turn", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendAltCunninghamUnaffordableTrashPlay",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const alt = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        welcomeToNightCityRetailAltCunninghamSoulkillerArchitect.id,
      );
      await pom.activateAbility(alt.instanceId, 1, CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

      const corporateSurveillance = await pom.getCardInZoneByDefinitionId(
        "trash",
        CYBERPUNK_P1,
        welcomeToNightCityRetailCorporateSurveillance.id,
      );
      await waitFor(() => {
        const unaffordable = view.container.ownerDocument.querySelector(
          `[data-testid="target-modal-card"][data-card-id="${corporateSurveillance.instanceId}"]`,
        );
        expectEqual(
          "Corporate Surveillance is marked unplayable",
          unaffordable?.getAttribute("data-selectable"),
          "false",
        );
        expectEqual(
          "Corporate Surveillance shows remaining Eddie cost",
          Boolean(unaffordable?.textContent?.includes("Needs 2 €$")),
          true,
        );
      });

      const harness = new WindowCyberpunkHarnessClient();
      await harness.dispatchEngine((engine) => {
        const failure = engine.expectFailure(() =>
          engine.resolveEffectTarget(welcomeToNightCityRetailCorporateSurveillance, {
            as: CYBERPUNK_P1,
            zone: "trash",
          }),
        );
        expectEqual(
          "unaffordable Corporate Surveillance error",
          failure.errorCode,
          "INSUFFICIENT_EDDIES",
        );
      });
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

      await pom.resolveEffectTargetPass(CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.getCardInZoneByDefinitionId(
        "trash",
        CYBERPUNK_P1,
        welcomeToNightCityRetailCorporateSurveillance.id,
      );
      await pom.passPhase(CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
