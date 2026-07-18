// @vitest-environment jsdom

import { describe, expect, test } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay,
  embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch,
  embracingPowerRetailStarterDeckYorinobuArasakaEmbracingDestruction,
  welcomeToNightCityRetailAppetiteForDestruction,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor,
  welcomeToNightCityRetailIndustrialAssembly,
  welcomeToNightCityRetailOverTheEdge,
  welcomeToNightCityRetailPepeNajarroWorkingDoubles,
  welcomeToNightCityRetailRitaWheelerNoStupidQuestions,
  welcomeToNightCityRetailViktorVektorYouMightFeelALittlePinch,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "../../../../cyberpunk-simulator-pom";
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
      await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailAppetiteForDestruction.id,
      );
      const hanako = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailPepeNajarroWorkingDoubles.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailRitaWheelerNoStupidQuestions.id,
      );
      const corpoSecurity = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        welcomeToNightCityRetailCorpoSecurity.id,
      );
      expect(
        view.container.querySelector(
          `[data-testid="active-effects-rail"] [data-source-card-id="${corpoSecurity.instanceId}"]`,
        ),
      ).toBeNull();

      await pom.activateAbility(hanako.instanceId, 0, CYBERPUNK_P1);
      const resolvingCard = view.container.querySelector<HTMLElement>(
        '[data-testid="resolving-program"]',
      );
      if (!resolvingCard?.textContent?.includes("Legend ability")) {
        throw new Error("Expected Hanako's activated ability overlay to say Legend ability.");
      }
    } finally {
      view.unmount();
    }
  });
});
