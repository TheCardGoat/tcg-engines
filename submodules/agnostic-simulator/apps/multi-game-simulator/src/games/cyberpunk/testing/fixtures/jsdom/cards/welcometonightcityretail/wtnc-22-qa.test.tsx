// @vitest-environment jsdom

import { describe, test } from "vite-plus/test";
import { fireEvent, waitFor } from "@testing-library/react";
import {
  welcomeToNightCityRetailAdrenalineConverter,
  welcomeToNightCityRetailArasakaEmergencyRadioport,
  welcomeToNightCityRetailChromeFang,
  welcomeToNightCityRetailDelamainRideshareAi,
  welcomeToNightCityRetailDexterDeshawnOffTheGrid,
  welcomeToNightCityRetailDonTFearTheReaper,
  welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
  welcomeToNightCityRetailGunpointDiplomacy,
  welcomeToNightCityRetailHeywoodRipperdoc,
  welcomeToNightCityRetailMaelstromGoons,
  welcomeToNightCityRetailMaxtacAv,
  welcomeToNightCityRetailModdedMuramasa,
  welcomeToNightCityRetailMuamarReyesElCapitan,
  welcomeToNightCityRetailPadreManOfTheCross,
  welcomeToNightCityRetailPanamPalmerStrengthThroughFamily,
  welcomeToNightCityRetailRogueAmendiaresPreemSolo,
  welcomeToNightCityRetailRuthlessLowlife,
  welcomeToNightCityRetailShatteredMemories,
  welcomeToNightCityRetailSwordwiseHuscle,
  welcomeToNightCityRetailTetratronicRippler,
  welcomeToNightCityRetailTraumaTeamOperatives,
  welcomeToNightCityRetailViktorVektorDropYourIllusions,
  welcomeToNightCityRetailWakakoOkadaPeaceAndHarmony,
  welcomeToNightCityRetailZetatechBerserk,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "../../../../cyberpunk-simulator-pom";
import { expectEqual } from "../../../../fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "../../../../fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "../../../../render-cyberpunk-simulator";
import type { ScenarioId } from "../../../../../types/e2e";

function installDomShims(): void {
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
}

async function renderQaBoard(scenarioId: ScenarioId) {
  installDomShims();
  const view = renderCyberpunkSimulatorScenario({ scenarioId });
  const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
  await pom.waitForReady();
  await pom.expectStructuralState();
  return { view, pom };
}

describe("WTNC 22-card visual QA boards", () => {
  test("fixer Call/Spend board hydrates Dexter, Muamar, and Padre", async () => {
    const { view, pom } = await renderQaBoard("retailWtnc22FixerCallQa");
    try {
      await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        welcomeToNightCityRetailDexterDeshawnOffTheGrid.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        welcomeToNightCityRetailMuamarReyesElCapitan.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        welcomeToNightCityRetailPadreManOfTheCross.id,
      );
    } finally {
      view.unmount();
    }
  });

  test("Padre guides source and target selection across players", async () => {
    const { view, pom } = await renderQaBoard("retailWtnc22FixerCallQa");
    try {
      const padre = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        welcomeToNightCityRetailPadreManOfTheCross.id,
      );
      await pom.callLegend(padre.instanceId, CYBERPUNK_P1);

      const drawOption = await waitFor(() => {
        const option = document.body.querySelector<HTMLElement>(
          '[data-testid="choose-effect-option"][data-option-id="draw"]',
        );
        if (!option) throw new Error("Padre's Draw 1 option did not render.");
        return option;
      });
      const header = document.body.querySelector<HTMLElement>(
        '[data-decision-type="resolveChooseEffect"] [data-testid="choice-modal-header"]',
      );
      if (!header?.textContent?.includes("Padre: Man of the Cross")) {
        throw new Error(
          `Choose effect header did not name Padre: ${header?.textContent ?? "missing"}`,
        );
      }
      const dialog = header.closest('[role="dialog"]');
      if (dialog?.getAttribute("aria-label") !== "Padre: Man of the Cross — Choose effect") {
        throw new Error("Choose effect dialog did not expose its source in the accessible title.");
      }
      if (
        !header.querySelector('[aria-label="Required effect — choose one effect to continue."]')
      ) {
        throw new Error("Choose effect header did not show its required-choice icon.");
      }
      fireEvent.click(drawOption);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);

      await pom.activateAbility(padre.instanceId, 1, CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

      const friendlyGigs = await pom.getGigDice(CYBERPUNK_P1);
      const rivalGigs = await pom.getGigDice(CYBERPUNK_P2);
      const source = friendlyGigs.find((die) => die.dieType === "d6");
      const samePlayerTarget = friendlyGigs.find((die) => die.dieType === "d10");
      const otherPlayerTarget = rivalGigs.find((die) => die.dieType === "d8");
      if (!source || !samePlayerTarget || !otherPlayerTarget) {
        throw new Error("Padre QA board does not contain the required Gig dice.");
      }

      const sourceButton = gigDieButton(view.container, source.id);
      const samePlayerButton = gigDieButton(view.container, samePlayerTarget.id);
      const otherPlayerButton = gigDieButton(view.container, otherPlayerTarget.id);
      const initialSequence = view.container.querySelector<HTMLElement>(
        '[data-testid="prompt-banner-sequence"]',
      );
      if (!initialSequence?.textContent?.includes("Step 1 of 2 — Source Gig: choose any Gig")) {
        throw new Error(
          `Padre prompt did not explain the source step: ${initialSequence?.textContent ?? "missing"}`,
        );
      }

      fireEvent.click(sourceButton);

      await waitFor(() => {
        expectEqual("selected Padre source", sourceButton.dataset.selected, "true");
        expectEqual("same-player target disabled", samePlayerButton.ariaDisabled, "true");
        expectEqual("other-player target enabled", otherPlayerButton.ariaDisabled, "false");
      });
      const targetSequence = view.container.querySelector<HTMLElement>(
        '[data-testid="prompt-banner-sequence"]',
      );
      if (!targetSequence?.textContent?.includes("other player's Gig")) {
        throw new Error("Padre prompt did not require a target owned by the other player.");
      }

      fireEvent.click(samePlayerButton);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      expectEqual("Padre source stays selected", sourceButton.dataset.selected, "true");
    } finally {
      view.unmount();
    }
  });

  test("combat/steal board hydrates programs, Goons, Ruthless, and Rogue", async () => {
    const { view, pom } = await renderQaBoard("retailWtnc22CombatStealQa");
    try {
      await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailChromeFang.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailGunpointDiplomacy.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailDonTFearTheReaper.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailDelamainRideshareAi.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailMaelstromGoons.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailRuthlessLowlife.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        welcomeToNightCityRetailRogueAmendiaresPreemSolo.id,
      );
    } finally {
      view.unmount();
    }
  });

  test("cost/Gear board hydrates Viktor, Heywood, Trauma Team, and Deadman", async () => {
    const { view, pom } = await renderQaBoard("retailWtnc22CostGearQa");
    try {
      await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailViktorVektorDropYourIllusions.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailHeywoodRipperdoc.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailTraumaTeamOperatives.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailZetatechBerserk.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailAdrenalineConverter.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailSwordwiseHuscle.id,
      );
    } finally {
      view.unmount();
    }
  });

  test("turn-trigger board hydrates Panam, Muramasa, Wakako, and Radioport", async () => {
    const { view, pom } = await renderQaBoard("retailWtnc22TurnTriggerQa");
    try {
      await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailPanamPalmerStrengthThroughFamily.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailModdedMuramasa.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailMaxtacAv.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailShatteredMemories.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailArasakaEmergencyRadioport.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailTetratronicRippler.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        welcomeToNightCityRetailGoroTakemuraVengefulBodyguard.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        welcomeToNightCityRetailWakakoOkadaPeaceAndHarmony.id,
      );
    } finally {
      view.unmount();
    }
  });
});

function gigDieButton(container: HTMLElement, dieId: string): HTMLElement {
  const button = container.querySelector<HTMLElement>(
    `[data-testid="gig-die"][data-die-id="${dieId}"]`,
  );
  if (!button) throw new Error(`No Gig control found for ${dieId}.`);
  return button;
}
