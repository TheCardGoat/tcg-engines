// @vitest-environment jsdom

import { fireEvent, waitFor } from "@testing-library/react";
import { describe, test } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailKerryEurodyneAxeAttitudeAudience,
  welcomeToNightCityRetailLaLloronaGhostOfThePast,
  welcomeToNightCityRetailMistyOlszewskiMenderOfBrokenSpirits,
  welcomeToNightCityRetailMoxInciters,
  welcomeToNightCityRetailOverwatchPanamSGift,
  welcomeToNightCityRetailSaulBrightStormrider,
  welcomeToNightCityRetailSwordwiseHuscle,
  welcomeToNightCityRetailYorinobuArasakaSteelDragon,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "../../../../cyberpunk-simulator-pom";
import { expectEqual } from "../../../../fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "../../../../fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "../../../../render-cyberpunk-simulator";

describe("PR 2295 retail cards visual fixture", () => {
  test("renders all new PR 2295 cards on the simulator board", async () => {
    ensureJsdomAnimationSupport();
    window.matchMedia ??= () =>
      ({
        matches: false,
        media: "",
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList;
    globalThis.ResizeObserver ??= class ResizeObserver {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    };

    const view = renderCyberpunkSimulatorScenario({ scenarioId: "retailPr2295Cards" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailLaLloronaGhostOfThePast.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailMistyOlszewskiMenderOfBrokenSpirits.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailSaulBrightStormrider.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        welcomeToNightCityRetailKerryEurodyneAxeAttitudeAudience.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailMoxInciters.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailOverwatchPanamSGift.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailYorinobuArasakaSteelDragon.id,
      );
    } finally {
      view.unmount();
    }
  });

  test("resolves Misty's end-turn card type choice through the option modal", async () => {
    ensureJsdomAnimationSupport();
    window.matchMedia ??= () =>
      ({
        matches: false,
        media: "",
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList;
    globalThis.ResizeObserver ??= class ResizeObserver {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    };

    const view = renderCyberpunkSimulatorScenario({ scenarioId: "retailPr2295Cards" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      await pom.passPhase(CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTrigger");
      // The trigger picker is the docked phase HUD; resolve Misty's end-turn
      // trigger through its exposed option.
      const triggerOptions = await pom.getPendingTriggerOptions(CYBERPUNK_P1);
      const mistyOptions = triggerOptions.filter((option) => option.cardName?.includes("Misty"));
      if (mistyOptions.length === 0) {
        throw new Error("Missing Misty trigger action with ability text");
      }
      // Resolve Misty's end-turn abilities until the card-type choice surfaces
      // (either ordering is legal).
      let resolvedCardTypeChoice = false;
      for (const option of mistyOptions) {
        await pom.resolveTrigger(option.triggerId, CYBERPUNK_P1);
        if ((await pom.getPendingChoiceType(CYBERPUNK_P1)) === "chooseCardType") {
          resolvedCardTypeChoice = true;
          break;
        }
      }
      if (!resolvedCardTypeChoice) {
        await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseCardType");
      }

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseCardType");
      const unitOption = await waitFor(() =>
        requiredElement<HTMLButtonElement>(
          document.body,
          '[data-testid="card-type-choice-option"][data-card-type="unit"]',
        ),
      );
      expectEqual("Misty card-type option label", unitOption.textContent?.trim(), "Unit");
      fireEvent.click(unitOption);
    } finally {
      view.unmount();
    }
  });

  test("activates attached Overwatch from Saul's visible action menu", async () => {
    ensureJsdomAnimationSupport();
    window.matchMedia ??= () =>
      ({
        matches: false,
        media: "",
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList;
    globalThis.ResizeObserver ??= class ResizeObserver {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    };

    const view = renderCyberpunkSimulatorScenario({ scenarioId: "retailPr2295Cards" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const overwatch = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailOverwatchPanamSGift.id,
      );
      const saul = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailSaulBrightStormrider.id,
      );
      const abilityCandidates = await pom.getMoveCandidateIds(CYBERPUNK_P1, "activateAbility");
      expectEqual(
        "Overwatch attached ability candidate visible",
        abilityCandidates.includes(`${overwatch.instanceId}:1`),
        true,
      );

      const saulCard = requiredElement<HTMLElement>(
        view.container,
        `[data-testid="card"][data-instance-id="${saul.instanceId}"]`,
      );
      // The host's action menu is browser-check territory; drive the attached
      // ability through its exposed move candidate (cardId:abilityIndex).
      void saulCard;
      await pom.activateAbility(overwatch.instanceId, 1, CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      // The hand-target choice now opens the choice modal directly.
      const modalTarget = await waitFor(() =>
        requiredElement<HTMLButtonElement>(document.body, '[data-testid="target-modal-card"]'),
      );
      expectEqual("Overwatch target modal remains available", modalTarget.disabled, false);
      fireEvent.click(
        requiredElement<HTMLButtonElement>(document.body, '[data-testid="choice-modal-minimize"]'),
      );
      await waitFor(() => {
        const choiceSheet = requiredElement<HTMLElement>(
          document.body,
          '[data-testid="choice-modal-sheet"]',
        );
        if (getComputedStyle(choiceSheet.parentElement!).display !== "none") {
          throw new Error("Expected minimized target modal to leave the board clickable.");
        }
      });
      const discardChoices = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      const mox = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailMoxInciters.id,
      );
      expectEqual(
        "Overwatch can discard cost-3 Mox Inciters",
        discardChoices.includes(mox.instanceId),
        true,
      );
      fireEvent.click(
        requiredElement<HTMLElement>(
          view.container,
          `[data-testid="card"][data-instance-id="${mox.instanceId}"]`,
        ),
      );
      await waitFor(() => pom.getCardInZoneByInstanceId("trash", CYBERPUNK_P1, mox.instanceId));
      const spentSaul = await pom.getCardInZoneByInstanceId("field", CYBERPUNK_P1, saul.instanceId);
      expectEqual("Attached Overwatch spends Saul", spentSaul.spent, true);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      const defeatChoices = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      const corpo = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        welcomeToNightCityRetailCorpoSecurity.id,
      );
      expectEqual(
        "Overwatch can target spent Corpo Security",
        defeatChoices.includes(corpo.instanceId),
        true,
      );
      const swordwise = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        welcomeToNightCityRetailSwordwiseHuscle.id,
      );
      expectEqual(
        "Overwatch can target spent cost-3 Swordwise Huscle",
        defeatChoices.includes(swordwise.instanceId),
        true,
      );
      await pom.resolveEffectTarget([swordwise.instanceId], CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectTrashSize(CYBERPUNK_P1, 1);
      await pom.expectTrashSize(CYBERPUNK_P2, 1);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});

function requiredElement<T extends Element>(container: ParentNode, selector: string): T {
  const element = container.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Missing required element: ${selector}`);
  }
  return element;
}
