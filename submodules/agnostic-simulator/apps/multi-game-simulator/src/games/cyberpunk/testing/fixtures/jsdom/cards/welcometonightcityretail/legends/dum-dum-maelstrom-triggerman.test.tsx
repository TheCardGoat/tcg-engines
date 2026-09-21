import { fireEvent, waitFor } from "@testing-library/react";
import { afterEach, describe, test } from "vite-plus/test";
import {
  theHeistRetailStarterDeckVCorporateExile,
  welcomeToNightCityRetailDumDumMaelstromTriggerman,
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailSwordwiseHuscle,
  welcomeToNightCityRetailTBugAmateurPhilosopher,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";
import { resetChoiceModalStateForTests } from "@cyberpunk/components/Prompt/choiceModalState";

describe("Dum Dum - Maelstrom Triggerman (Retail) jsdom happy path", () => {
  afterEach(() => {
    resetChoiceModalStateForTests();
  });

  test("CALL highlights attached Gear on the board instead of auto-opening a modal", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendDumDumMaelstromTriggermanRetail",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const dumDum = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        welcomeToNightCityRetailDumDumMaelstromTriggerman.id,
      );
      const host = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailTBugAmateurPhilosopher.id,
      );
      const kiroshi = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailKiroshiOptics.id,
      );
      const handBefore = await pom.getHandSize(CYBERPUNK_P1);

      await pom.callLegend(dumDum.instanceId, CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseCardToMove");

      await waitFor(() => {
        if (view.container.ownerDocument.querySelector('[data-testid="choice-modal-sheet"]')) {
          throw new Error("Expected Dum Dum CALL not to auto-open the choice modal.");
        }
        requiredEligibleGear(view.container.ownerDocument, host.instanceId, kiroshi.instanceId);
      });

      const skip = requiredElement<HTMLButtonElement>(
        view.container.ownerDocument,
        '[data-testid="prompt-target-pass"]',
      );
      fireEvent.click(skip);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectHandSize(CYBERPUNK_P1, handBefore + 1);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });

  test("CALL lets the player click one of two identical Gears on different Units", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendDumDumDuplicateGearRetail",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();

      const dumDum = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        welcomeToNightCityRetailDumDumMaelstromTriggerman.id,
      );
      const tBug = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailTBugAmateurPhilosopher.id,
      );
      const swordwise = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailSwordwiseHuscle.id,
      );

      await pom.callLegend(dumDum.instanceId, CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseCardToMove");

      await waitFor(() => {
        requiredEligibleGear(view.container.ownerDocument, tBug.instanceId);
        requiredEligibleGear(view.container.ownerDocument, swordwise.instanceId);
      });

      fireEvent.click(
        requiredElement<HTMLButtonElement>(
          view.container.ownerDocument,
          '[data-testid="prompt-target-modal-open"]',
        ),
      );
      const tBugModalCard = await waitFor(() => {
        const hosts = [
          ...view.container.ownerDocument.querySelectorAll('[data-testid="target-modal-host"]'),
        ].map((node) => node.textContent ?? "");
        if (hosts.length < 2) {
          throw new Error("Expected the choice modal to name both Gear hosts.");
        }
        if (!hosts.some((host) => host.includes("T-Bug"))) {
          throw new Error(`Expected a modal host for T-Bug, got ${hosts.join(" | ")}`);
        }
        if (!hosts.some((host) => host.includes("Swordwise"))) {
          throw new Error(`Expected a modal host for Swordwise Huscle, got ${hosts.join(" | ")}`);
        }
        const card = [
          ...view.container.ownerDocument.querySelectorAll<HTMLButtonElement>(
            '[data-testid="target-modal-card"]',
          ),
        ].find((candidate) => candidate.getAttribute("data-host-name")?.includes("T-Bug"));
        if (!card) {
          throw new Error("Expected a modal card attached to T-Bug.");
        }
        return card;
      });
      fireEvent.click(tBugModalCard);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectTrashSize(CYBERPUNK_P1, 1);
    } finally {
      view.unmount();
    }
  });

  test("CALL highlights Gear attached to a Legend and leaves a clickable peek", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendDumDumLegendGearRetail",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();

      const dumDum = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        welcomeToNightCityRetailDumDumMaelstromTriggerman.id,
      );
      const legendHost = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        theHeistRetailStarterDeckVCorporateExile.id,
      );
      const unitHost = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailTBugAmateurPhilosopher.id,
      );

      await pom.callLegend(dumDum.instanceId, CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseCardToMove");

      const legendSlot = requiredElement<HTMLElement>(
        view.container,
        `[data-testid="legend-slot"][data-card-id="${legendHost.instanceId}"]`,
      );
      if (legendSlot.getAttribute("data-attached-gear-count") !== "1") {
        throw new Error("Expected the equipped Legend slot to reserve attached-gear space.");
      }
      const identity = requiredElement<HTMLElement>(
        view.container,
        '[data-testid="game-board"][data-side="player"] [data-testid="mid-identity"]',
      );
      if (identity.getAttribute("data-legend-gear-count") !== "1") {
        throw new Error("Expected the identity row to reserve Legend gear peek space.");
      }

      const legendGear = await waitFor(() =>
        requiredEligibleGear(view.container.ownerDocument, legendHost.instanceId),
      );
      requiredEligibleGear(view.container.ownerDocument, unitHost.instanceId);
      fireEvent.click(legendGear);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectTrashSize(CYBERPUNK_P1, 1);
    } finally {
      view.unmount();
    }
  });
});

function requiredEligibleGear(
  root: ParentNode,
  hostId: string,
  gearId?: string,
): HTMLButtonElement {
  const selector = gearId
    ? `[data-testid="attached-gear"][data-attached-to-id="${hostId}"] [data-choice-eligible="true"][data-card-id="${gearId}"]`
    : `[data-testid="attached-gear"][data-attached-to-id="${hostId}"] [data-choice-eligible="true"]`;
  return requiredElement<HTMLButtonElement>(root, selector);
}

function requiredElement<T extends Element>(root: ParentNode, selector: string): T {
  const found = root.querySelector(selector);
  if (!found) {
    throw new Error(`Expected ${selector}`);
  }
  return found as T;
}
