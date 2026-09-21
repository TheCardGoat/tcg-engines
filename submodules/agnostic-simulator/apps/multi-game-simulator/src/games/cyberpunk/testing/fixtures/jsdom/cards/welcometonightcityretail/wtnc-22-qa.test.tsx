// @vitest-environment jsdom

import { describe, test } from "vite-plus/test";
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
import { CYBERPUNK_P1 } from "../../../../cyberpunk-simulator-pom";
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
