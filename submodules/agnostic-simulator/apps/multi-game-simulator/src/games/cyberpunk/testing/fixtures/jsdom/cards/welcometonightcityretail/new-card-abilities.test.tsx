// @vitest-environment jsdom

import { describe, test } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay,
  embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch,
  embracingPowerRetailStarterDeckYorinobuArasakaEmbracingDestruction,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailIndustrialAssembly,
  welcomeToNightCityRetailOverTheEdge,
  welcomeToNightCityRetailViktorVektorYouMightFeelALittlePinch,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "../../../../cyberpunk-simulator-pom";
import { ensureJsdomAnimationSupport } from "../../../../fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "../../../../render-cyberpunk-simulator";

describe("new retail card abilities visual fixture", () => {
  test("renders the new ability review board for human inspection", async () => {
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

    const view = renderCyberpunkSimulatorScenario({ scenarioId: "retailNewCardAbilities" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        embracingPowerRetailStarterDeckYorinobuArasakaEmbracingDestruction.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailFieldOperator.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailIndustrialAssembly.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailOverTheEdge.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailViktorVektorYouMightFeelALittlePinch.id,
      );
    } finally {
      view.unmount();
    }
  });
});
