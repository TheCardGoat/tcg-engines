import { describe, test } from "vite-plus/test";
import { fireEvent, waitFor } from "@testing-library/react";
import {
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailLizzyWizzyDelicateWeapon,
  welcomeToNightCityRetailPeaceOffering,
  welcomeToNightCityRetailRebootOptics,
  welcomeToNightCityRetailSandayuOdaHanakoSGuardian,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import {
  expectIncludes,
  getChoiceDefinitionIds,
} from "@cyberpunk/testing/fixture-behaviors/cyberpunk-unit-fixture-helpers";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Sandayu Oda jsdom happy path (Retail)", () => {
  test("lizzy Wizzy target modal groups duplicate Programs by hand and trash", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "unitSandayuOdaHanakoSGuardianRetail",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const lizzy = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailLizzyWizzyDelicateWeapon.id,
      );
      const handReboot = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailRebootOptics.id,
      );
      const trashReboot = await pom.getCardInZoneByDefinitionId(
        "trash",
        CYBERPUNK_P1,
        welcomeToNightCityRetailRebootOptics.id,
      );

      await pom.playCardFromHand(lizzy.instanceId, CYBERPUNK_P1);

      await waitFor(() => {
        const groups = document.body.querySelectorAll('[data-testid="target-modal-zone-group"]');
        if (groups.length !== 2) {
          throw new Error(`Expected Hand and Trash modal groups, got ${groups.length}.`);
        }
      });

      expectZoneGroup("hand", "Hand", 2);
      expectZoneGroup("trash", "Trash", 2);
      expectTargetCardSource(handReboot.instanceId, "hand", "Select Reboot Optics from Hand");
      expectTargetCardSource(trashReboot.instanceId, "trash", "Select Reboot Optics from Trash");

      const trashTarget = requiredTargetCard(trashReboot.instanceId);
      fireEvent.click(trashTarget);

      await waitFor(() => {
        const lizzyTargets = [handReboot.instanceId, trashReboot.instanceId].flatMap((cardId) => {
          const target = findTargetCard(cardId);
          return target ? [target] : [];
        });
        if (lizzyTargets.length > 0) {
          throw new Error("Expected the Lizzy hand/trash Program picker to close after selection.");
        }
      });
    } finally {
      view.unmount();
    }
  });

  test("lizzy Wizzy target modal submits the hand duplicate instance", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "unitSandayuOdaHanakoSGuardianRetail",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();

      const lizzy = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailLizzyWizzyDelicateWeapon.id,
      );
      const handPeaceOffering = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailPeaceOffering.id,
      );

      await pom.playCardFromHand(lizzy.instanceId, CYBERPUNK_P1);
      const handTarget = requiredTargetCard(handPeaceOffering.instanceId);
      fireEvent.click(handTarget);

      await waitFor(async () => {
        const handCards = await pom.getCardsInZone("hand", CYBERPUNK_P1);
        if (handCards.some((card) => card.instanceId === handPeaceOffering.instanceId)) {
          throw new Error("Expected the selected hand Program instance to leave hand.");
        }
      });
    } finally {
      view.unmount();
    }
  });

  test("sandayu Oda - value pairs spend units and allow unit attack (Retail)", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "unitSandayuOdaHanakoSGuardianRetail",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const sandayuInHand = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailSandayuOdaHanakoSGuardian.id,
      );
      const corpo = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        welcomeToNightCityRetailCorpoSecurity.id,
      );
      const minotaur = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        embracingPowerRetailStarterDeckMinotaur.id,
      );

      await pom.playCardFromHand(sandayuInHand.instanceId, CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      const eligibleDefinitions = await getChoiceDefinitionIds(pom, eligible);
      expectEqual("Sandayu spend target count", eligible.length, 2);
      expectIncludes(
        "Sandayu spend targets",
        eligibleDefinitions,
        welcomeToNightCityRetailCorpoSecurity.id,
      );
      expectIncludes(
        "Sandayu spend targets",
        eligibleDefinitions,
        embracingPowerRetailStarterDeckMinotaur.id,
      );

      await pom.resolveEffectTarget([corpo.instanceId, minotaur.instanceId], CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectFieldCardSpent(CYBERPUNK_P2, corpo.instanceId, true);
      await pom.expectFieldCardSpent(CYBERPUNK_P2, minotaur.instanceId, true);

      const sandayu = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailSandayuOdaHanakoSGuardian.id,
      );
      await pom.expectFieldCardGrantedRule(
        CYBERPUNK_P1,
        sandayu.instanceId,
        "canAttackOnPlayedTurnAgainstUnits",
        true,
      );

      const attackers = await pom.getMoveCandidateIds(CYBERPUNK_P1, "attackUnit");
      const targets = await pom.getMoveTargetCandidateIds(CYBERPUNK_P1, "attackUnit");
      if (!attackers.includes(sandayu.instanceId)) {
        throw new Error("Expected Sandayu to be an attackUnit candidate after being played.");
      }
      if (!targets.includes(corpo.instanceId) || !targets.includes(minotaur.instanceId)) {
        throw new Error("Expected Sandayu to attack spent rival units after its play trigger.");
      }

      const directCandidates = await pom.getMoveCandidateIds(CYBERPUNK_P1, "attackRival");
      if (directCandidates.includes(sandayu.instanceId)) {
        throw new Error("Expected Sandayu not to attack the rival directly on played turn.");
      }

      await pom.attackUnit(sandayu.instanceId, corpo.instanceId, CYBERPUNK_P1);

      const attack = await pom.getAttackState();
      if (!attack) {
        throw new Error("Expected Sandayu to start a fight against a spent unit.");
      }
      expectEqual("Sandayu attack kind", attack.kind, "fight");
      expectEqual("Sandayu attack defender", attack.defenderId, corpo.instanceId);
      await pom.expectFieldCardSpent(CYBERPUNK_P1, sandayu.instanceId, true);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});

function expectZoneGroup(zone: string, label: string, count: number): void {
  const group = document.body.querySelector<HTMLElement>(
    `[data-testid="target-modal-zone-group"][data-zone="${zone}"]`,
  );
  if (!group) {
    throw new Error(`Expected ${label} modal group.`);
  }
  const heading = group.querySelector('[data-testid="target-modal-zone-heading"]')?.textContent;
  if (heading !== label) {
    throw new Error(`Expected ${label} heading, got ${heading ?? "<none>"}.`);
  }
  const cards = group.querySelectorAll('[data-testid="target-modal-card"]');
  expectEqual(`${label} modal group count`, cards.length, count);
}

function expectTargetCardSource(cardId: string, zone: string, label: string): void {
  const card = requiredTargetCard(cardId);
  expectEqual(`${cardId} source zone`, card.dataset.zone ?? "", zone);
  if (card.getAttribute("aria-label") !== label) {
    throw new Error(
      `Expected target aria-label "${label}", got "${card.getAttribute("aria-label")}".`,
    );
  }
  const badge = card.querySelector('[data-testid="target-modal-zone-badge"]')?.textContent;
  const expectedBadge = zone === "hand" ? "Hand" : "Trash";
  if (badge !== expectedBadge) {
    throw new Error(`Expected ${expectedBadge} badge, got ${badge ?? "<none>"}.`);
  }
}

function requiredTargetCard(cardId: string): HTMLButtonElement {
  const target = findTargetCard(cardId);
  if (!target) {
    throw new Error(`Missing target modal card ${cardId}.`);
  }
  return target;
}

function findTargetCard(cardId: string): HTMLButtonElement | undefined {
  return [
    ...document.body.querySelectorAll<HTMLButtonElement>('[data-testid="target-modal-card"]'),
  ].find((card) => card.dataset.cardId === cardId);
}
