import { fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vite-plus/test";
import {
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailSecondhandBombus,
  welcomeToNightCityRetailSwordwiseHuscle,
  theHeistRetailStarterDeckViktorVektorSitDownAndRelax,
  welcomeToNightCityRetailMandibularUpgrade,
  welcomeToNightCityRetailViktorVektorYouMightFeelALittlePinch,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Viktor Vektor - Sit Down and Relax jsdom happy path", () => {
  test("opens shared Trash viewer from player card and opponent zone", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendViktorVektorSitDownAndRelax",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      const mandibularUpgrade = await pom.getCardInZoneByDefinitionId(
        "trash",
        CYBERPUNK_P1,
        welcomeToNightCityRetailMandibularUpgrade.id,
      );

      const playerTrashZone = view.container.querySelector<HTMLElement>(
        '[data-testid="trash-zone"][data-zone-id="p-trash"]',
      );
      const opponentTrashZone = view.container.querySelector<HTMLElement>(
        '[data-testid="trash-zone"][data-zone-id="opp-trash"]',
      );
      expect(playerTrashZone).not.toBeNull();
      expect(opponentTrashZone).not.toBeNull();
      expect(playerTrashZone?.getAttribute("role")).toBe("button");
      expect(playerTrashZone?.getAttribute("tabindex")).toBe("0");
      expect(opponentTrashZone?.getAttribute("role")).toBe("button");
      expect(opponentTrashZone?.getAttribute("tabindex")).toBe("0");
      expect(playerTrashZone?.getAttribute("data-count")).toBe("1");
      expect(opponentTrashZone?.getAttribute("data-count")).toBe("0");

      const playerTrashTopCard = playerTrashZone?.querySelector<HTMLElement>(
        '[data-testid="trash-card"]',
      );
      expect(playerTrashTopCard).not.toBeNull();
      fireEvent.click(playerTrashTopCard!);
      await waitFor(() => {
        expect(document.body.querySelector('[data-testid="target-filter-modal"]')).not.toBeNull();
      });
      expect(
        document.body.querySelector('[data-testid="target-filter-modal-count"]')?.textContent,
      ).toBe("1 card");
      expect(
        document.body.querySelector(
          `[data-testid="target-filter-modal"] [data-sim-entity-id="${mandibularUpgrade.instanceId}"]`,
        ),
      ).not.toBeNull();
      fireEvent.click(document.body.querySelector('[data-testid="target-filter-modal-close"]')!);
      await waitFor(() => {
        expect(document.body.querySelector('[data-testid="target-filter-modal"]')).toBeNull();
      });

      fireEvent.click(opponentTrashZone!);
      await waitFor(() => {
        expect(document.body.querySelector('[data-testid="target-filter-modal"]')).not.toBeNull();
      });
      expect(
        document.body.querySelector('[data-testid="target-filter-modal-count"]')?.textContent,
      ).toBe("0 cards");
      expect(
        document.body.querySelector('[data-testid="target-filter-modal-empty"]')?.textContent,
      ).toBe("Trash is empty");
      fireEvent.click(document.body.querySelector('[data-testid="target-filter-modal-close"]')!);
      await waitFor(() => {
        expect(document.body.querySelector('[data-testid="target-filter-modal"]')).toBeNull();
      });
    } finally {
      view.unmount();
    }
  });

  test("calls to search top deck for low-cost gear", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendViktorVektorSitDownAndRelax",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const viktor = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        theHeistRetailStarterDeckViktorVektorSitDownAndRelax.id,
      );
      const host = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailSwordwiseHuscle.id,
      );
      const otherHost = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailSecondhandBombus.id,
      );
      const retailViktor = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailViktorVektorYouMightFeelALittlePinch.id,
      );
      const mandibularUpgrade = await pom.getCardInZoneByDefinitionId(
        "trash",
        CYBERPUNK_P1,
        welcomeToNightCityRetailMandibularUpgrade.id,
      );

      const playerTrashZone = view.container.querySelector<HTMLElement>(
        '[data-testid="trash-zone"][data-zone-id="p-trash"]',
      );
      const opponentTrashZone = view.container.querySelector<HTMLElement>(
        '[data-testid="trash-zone"][data-zone-id="opp-trash"]',
      );
      expect(playerTrashZone).not.toBeNull();
      expect(opponentTrashZone).not.toBeNull();
      expect(playerTrashZone?.getAttribute("role")).toBe("button");
      expect(playerTrashZone?.getAttribute("tabindex")).toBe("0");
      expect(opponentTrashZone?.getAttribute("role")).toBe("button");
      expect(opponentTrashZone?.getAttribute("tabindex")).toBe("0");
      expect(playerTrashZone?.getAttribute("data-count")).toBe("1");
      expect(opponentTrashZone?.getAttribute("data-count")).toBe("0");
      expect(
        playerTrashZone?.querySelector(
          `[data-testid="trash-card"][data-card-id="${mandibularUpgrade.instanceId}"]`,
        ),
      ).not.toBeNull();

      await pom.callLegend(viktor.instanceId, CYBERPUNK_P1);

      const calledViktor = await pom.getCardInZoneByInstanceId(
        "legendArea",
        CYBERPUNK_P1,
        viktor.instanceId,
      );
      expectEqual("Viktor is face-up", calledViktor.faceDown, false);
      await pom.expectEddies(CYBERPUNK_P1, 3);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "searchDeck");

      const revealed = await pom.getSearchDeckRevealedCardIds(CYBERPUNK_P1);
      expectEqual("Viktor reveal count", revealed.length, 5);
      const revealedDefinitions = await Promise.all(
        revealed.map((cardId) => pom.getCardDefinitionId(cardId)),
      );
      const selected = [
        revealed[revealedDefinitions.indexOf(welcomeToNightCityRetailKiroshiOptics.id)]!,
        revealed[revealedDefinitions.indexOf(welcomeToNightCityRetailMantisBlades.id)]!,
      ];
      if (selected.some((cardId) => !cardId)) {
        throw new Error("Expected Viktor search to reveal Kiroshi Optics and Mantis Blades.");
      }

      await pom.resolveSearchDeck(selected, CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectHandSize(CYBERPUNK_P1, 4);
      expectEqual("Viktor deck after selecting two gear", await pom.getDeckSize(CYBERPUNK_P1), 34);

      await pom.playCardFromHand(retailViktor.instanceId, CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      await waitFor(() => {
        expect(view.container.querySelector('[data-testid="resolving-program"]')).not.toBeNull();
      });
      const resolvingTrigger = view.container.querySelector<HTMLElement>(
        '[data-testid="resolving-program"]',
      );
      expect(resolvingTrigger?.getAttribute("data-card-id")).toBe(retailViktor.instanceId);
      expect(resolvingTrigger?.getAttribute("data-card-type")).toBe("unit");
      expect(resolvingTrigger?.querySelector(`span`)?.textContent).toBe("Play trigger");
      expect(
        resolvingTrigger?.querySelector(
          `[data-testid="resolving-program-card"][data-sim-anchor-id="resolving-program:${retailViktor.instanceId}"]`,
        ),
      ).not.toBeNull();
      expect(document.body.querySelector('[data-testid="choice-modal-minimize"]')).not.toBeNull();
      expect(document.body.querySelector('[data-testid="target-modal-card"]')).not.toBeNull();

      const eligibleGearTargets = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      if (!eligibleGearTargets.includes(mandibularUpgrade.instanceId)) {
        throw new Error("Expected retail Viktor to let P1 select Mandibular Upgrade from trash.");
      }

      await pom.resolveEffectTarget([mandibularUpgrade.instanceId], CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      const eligibleAttachTargets = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      if (!eligibleAttachTargets.includes(host.instanceId)) {
        throw new Error("Expected retail Viktor to let P1 select Swordwise Huscle as attach host.");
      }
      if (!eligibleAttachTargets.includes(otherHost.instanceId)) {
        throw new Error(
          "Expected retail Viktor to let P1 select Secondhand Bombus as attach host.",
        );
      }
      if (eligibleAttachTargets.includes(retailViktor.instanceId)) {
        throw new Error("Expected retail Viktor not to be eligible to attach Gear to itself.");
      }

      await pom.resolveEffectTarget([host.instanceId], CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectEddies(CYBERPUNK_P1, 0);
      await pom.expectHandSize(CYBERPUNK_P1, 3);
      await pom.expectTrashSize(CYBERPUNK_P1, 0);
      await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, host.instanceId, 1);
      const attachedGear = await pom.getCardInZoneByInstanceId(
        "field",
        CYBERPUNK_P1,
        mandibularUpgrade.instanceId,
      );
      expectEqual(
        "Mandibular Upgrade attached to selected unit",
        attachedGear.attachedToId,
        host.instanceId,
      );
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
