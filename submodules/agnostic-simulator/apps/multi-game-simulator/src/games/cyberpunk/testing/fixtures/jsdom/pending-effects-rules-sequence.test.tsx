// @vitest-environment jsdom

import { fireEvent, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vite-plus/test";
import {
  welcomeToNightCityRetailAdamSmasherMetalOverMeat,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailLiveWithTheAftermath,
  welcomeToNightCityRetailRiverWardDetectiveOnTheHunt,
  welcomeToNightCityRetailSwordwiseHuscle,
  welcomeToNightCityRetailTheRelicExperimentalBiochip,
} from "@tcg/cyberpunk-cards";
import { resetChoiceModalStateForTests } from "@cyberpunk/components/Prompt/choiceModalState";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("River Ward, The Relic, and Adam Smasher pending-effect sequence", () => {
  afterEach(() => {
    resetChoiceModalStateForTests();
  });

  test("lets the player order trash and resolve dynamically-added effects in rules order", async () => {
    ensureJsdomAnimationSupport();
    installResizeObserverStub();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "pendingEffectsRiverRelicAdamSmasher",
    });

    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      const program = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailLiveWithTheAftermath.id,
      );
      const equippedUnit = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailFieldOperator.id,
      );
      const rivalChoice = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        welcomeToNightCityRetailDelamainCab.id,
      );

      await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      await pom.resolveEffectTarget([equippedUnit.instanceId], CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P2, "chooseTarget");
      await pom.resolveEffectTarget([rivalChoice.instanceId], CYBERPUNK_P2);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTrigger");
      const initialEffects = await waitForChoiceSheet();
      expect(pendingEffectNames(initialEffects)).toEqual([
        welcomeToNightCityRetailRiverWardDetectiveOnTheHunt.displayName,
        welcomeToNightCityRetailTheRelicExperimentalBiochip.displayName,
      ]);
      expect(
        initialEffects.querySelector(
          `img[alt="${welcomeToNightCityRetailRiverWardDetectiveOnTheHunt.displayName}"]`,
        ),
      ).not.toBeNull();
      expect(
        initialEffects.querySelector(
          `img[alt="${welcomeToNightCityRetailTheRelicExperimentalBiochip.displayName}"]`,
        ),
      ).not.toBeNull();

      fireEvent.click(
        pendingEffectButton(
          initialEffects,
          welcomeToNightCityRetailTheRelicExperimentalBiochip.displayName,
        ),
      );
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

      const adam = await pom.getCardInZoneByDefinitionId(
        "trash",
        CYBERPUNK_P1,
        welcomeToNightCityRetailAdamSmasherMetalOverMeat.id,
      );
      const targetSheet = await waitForChoiceSheet();
      const adamTarget = requiredElement<HTMLButtonElement>(
        targetSheet,
        `[data-testid="target-modal-card"][data-card-id="${adam.instanceId}"]`,
      );
      expect(adamTarget.querySelector('img[alt="Adam Smasher: Metal Over Meat"]')).not.toBeNull();
      fireEvent.click(adamTarget);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTrigger");
      const effectsAfterAdamEnters = await waitForChoiceSheet();
      expect(pendingEffectNames(effectsAfterAdamEnters)).toEqual([
        welcomeToNightCityRetailRiverWardDetectiveOnTheHunt.displayName,
        welcomeToNightCityRetailAdamSmasherMetalOverMeat.displayName,
      ]);

      const deckAfterRelic = await pom.getCardsInZone("deck", CYBERPUNK_P1);
      expect(deckAfterRelic.at(-1)?.definitionId).toBe(welcomeToNightCityRetailFieldOperator.id);
      const trashAfterRelic = await pom.getCardsInZone("trash", CYBERPUNK_P1);
      expect(trashAfterRelic.map((card) => card.definitionId)).toContain(
        welcomeToNightCityRetailTheRelicExperimentalBiochip.id,
      );
      expect(trashAfterRelic.map((card) => card.definitionId)).not.toContain(
        welcomeToNightCityRetailFieldOperator.id,
      );

      fireEvent.click(
        pendingEffectButton(
          effectsAfterAdamEnters,
          welcomeToNightCityRetailAdamSmasherMetalOverMeat.displayName,
        ),
      );

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "scry");
      await pom.expectFieldSize(CYBERPUNK_P1, 1);
      await pom.expectFieldSize(CYBERPUNK_P2, 0);
      await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailAdamSmasherMetalOverMeat.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "trash",
        CYBERPUNK_P1,
        welcomeToNightCityRetailSwordwiseHuscle.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "trash",
        CYBERPUNK_P2,
        welcomeToNightCityRetailDelamainCab.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "trash",
        CYBERPUNK_P2,
        welcomeToNightCityRetailCorpoSecurity.id,
      );

      const searchSheet = await waitForChoiceSheet();
      const searchedCards = [
        ...searchSheet.querySelectorAll<HTMLButtonElement>('[data-testid="search-deck-card"]'),
      ];
      expect(searchedCards).toHaveLength(2);
      const selectedCardId = searchedCards[0]?.dataset.cardId;
      const returnedCardId = searchedCards[1]?.dataset.cardId;
      if (!selectedCardId || !returnedCardId) {
        throw new Error("River Ward must expose two selectable deck cards.");
      }
      fireEvent.click(searchedCards[0]!);

      await waitFor(async () => {
        await expect(pom.getPendingChoiceType(CYBERPUNK_P1)).resolves.toBeNull();
      });
      expect(
        (await pom.getCardsInZone("trash", CYBERPUNK_P1)).map((card) => card.instanceId),
      ).toContain(selectedCardId);
      expect((await pom.getCardsInZone("deck", CYBERPUNK_P1))[0]?.instanceId).toBe(returnedCardId);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});

async function waitForChoiceSheet(): Promise<HTMLElement> {
  return waitFor(() =>
    requiredElement<HTMLElement>(document.body, '[data-testid="choice-modal-sheet"]'),
  );
}

function pendingEffectNames(sheet: ParentNode): string[] {
  return [...sheet.querySelectorAll<HTMLElement>('[data-testid="pending-effect-option"]')].map(
    (option) =>
      option.querySelector<HTMLImageElement>("img")?.alt ??
      (() => {
        throw new Error("Pending effect option must show its source card image.");
      })(),
  );
}

function pendingEffectButton(sheet: ParentNode, cardName: string): HTMLButtonElement {
  const option = [
    ...sheet.querySelectorAll<HTMLButtonElement>('[data-testid="pending-effect-option"]'),
  ].find((candidate) => candidate.querySelector<HTMLImageElement>("img")?.alt === cardName);
  if (!option) {
    throw new Error(`Missing pending effect option for ${cardName}.`);
  }
  return option;
}

function installResizeObserverStub(): void {
  globalThis.ResizeObserver ??= class ResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
}

function requiredElement<T extends Element>(container: ParentNode, selector: string): T {
  const element = container.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Missing required element: ${selector}`);
  }
  return element;
}
