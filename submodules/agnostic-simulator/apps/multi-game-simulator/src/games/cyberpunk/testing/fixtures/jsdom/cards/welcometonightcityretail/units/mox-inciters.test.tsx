import { describe, expect, test } from "vite-plus/test";
import { notifications } from "@mantine/notifications";
import { fireEvent } from "@testing-library/react";
import {
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailMoxInciters,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

const MUST_ATTACK_PASS_REASON = "A Unit must attack before you can pass.";

describe("Mox Inciters (Retail) jsdom happy path", () => {
  test("mox Inciters blocks passing with visible must-attack guidance", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "unitMoxIncitersRetail" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const inciters = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailMoxInciters.id,
      );
      const requiredAttacker = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        embracingPowerRetailStarterDeckMinotaur.id,
      );
      const unmarkedRivalUnit = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        welcomeToNightCityRetailCorpoSecurity.id,
      );

      await pom.playCardFromHand(inciters.instanceId, CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      await pom.resolveEffectTarget([requiredAttacker.instanceId], CYBERPUNK_P1);
      await pom.harness.dispatchEngine((engine) => engine.skipToNextPlayerTurn(CYBERPUNK_P1));
      await pom.takeControl(CYBERPUNK_P2);

      const attackers = await pom.getMoveCandidateIds(CYBERPUNK_P2, "attackRival");
      if (!attackers.includes(requiredAttacker.instanceId)) {
        throw new Error("Expected the incited Unit to remain available as an attack action.");
      }

      const mustAttackBadge = getCardRuleBadge(
        view.container,
        requiredAttacker.instanceId,
        "mustAttack",
      );
      if (!mustAttackBadge) {
        throw new Error("Expected the incited Unit to show a must-attack badge.");
      }
      expect(mustAttackBadge.getAttribute("aria-label")).toContain("Must attack");
      expect(mustAttackBadge.getAttribute("aria-label")).toContain("Source: Mox Inciters");
      if (getCardRuleBadge(view.container, unmarkedRivalUnit.instanceId, "mustAttack")) {
        throw new Error("Expected only the incited Unit to show a must-attack badge.");
      }

      const passVerb = view.container.querySelector<HTMLButtonElement>(
        '[data-testid="prompt-banner"][data-side="opponent"] [data-testid="prompt-verb-passPhase"]',
      );
      if (!passVerb) {
        throw new Error("Expected the prompt banner to render disabled Pass Turn.");
      }
      expectEqual("Mox Inciters prompt pass disabled", passVerb.disabled, true);
      expectEqual(
        "Mox Inciters prompt pass title",
        passVerb.getAttribute("title"),
        MUST_ATTACK_PASS_REASON,
      );
      if (!passVerb.getAttribute("aria-label")?.includes(MUST_ATTACK_PASS_REASON)) {
        throw new Error("Expected prompt Pass Turn aria-label to explain why it is disabled.");
      }
      const passVerbHitTarget = view.container.querySelector<HTMLElement>(
        '[data-testid="prompt-verb-passPhase-hit-target"]',
      );
      if (!passVerbHitTarget) {
        throw new Error("Expected blocked prompt Pass Turn to expose a clickable hit target.");
      }
      fireEvent.click(passVerbHitTarget);
      await view.findByText("Pass Turn blocked");

      const bannerMessage = view.container.querySelector<HTMLElement>(
        '[data-testid="prompt-banner"][data-side="opponent"] [data-testid="prompt-banner-message"]',
      );
      expectEqual(
        "Mox Inciters prompt guidance",
        bannerMessage?.textContent,
        MUST_ATTACK_PASS_REASON,
      );

      const phaseAdvance = view.container.querySelector<HTMLButtonElement>(
        '[data-testid="phase-advance"]',
      );
      if (!phaseAdvance) {
        throw new Error("Expected the phase advance button to render.");
      }
      expectEqual("Mox Inciters phase advance disabled", phaseAdvance.disabled, true);
      expectEqual(
        "Mox Inciters phase advance title",
        phaseAdvance.getAttribute("title"),
        MUST_ATTACK_PASS_REASON,
      );
      expectEqual(
        "Mox Inciters phase advance aria",
        phaseAdvance.getAttribute("aria-label"),
        MUST_ATTACK_PASS_REASON,
      );
      const phaseAdvanceHitTarget = view.container.querySelector<HTMLElement>(
        '[data-testid="phase-advance-hit-target"]',
      );
      if (!phaseAdvanceHitTarget) {
        throw new Error("Expected blocked phase advance to expose a clickable hit target.");
      }
      notifications.clean();
      await new Promise((resolve) => setTimeout(resolve, 1250));
      fireEvent.click(phaseAdvanceHitTarget);
      await view.findByText("Pass Turn blocked");

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });

  test("shows the source-aware mustAttack cue while the effect is active", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "unitWelcomeToNightCityRetailMoxIncitersMustAttack",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const mox = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailMoxInciters.id,
      );
      const forcedUnit = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        welcomeToNightCityRetailCorpoSecurity.id,
      );

      await pom.playCardFromHand(mox.instanceId, CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      await pom.resolveEffectTarget([forcedUnit.instanceId], CYBERPUNK_P1);

      await pom.expectFieldCardGrantedRule(CYBERPUNK_P2, forcedUnit.instanceId, "mustAttack", true);
      expect(mustAttackBadgeLabel(view.container, forcedUnit.instanceId)).toContain(
        "Source: Mox Inciters",
      );

      await pom.passPhase(CYBERPUNK_P1);
      await pom.expectFieldCardGrantedRule(CYBERPUNK_P2, forcedUnit.instanceId, "mustAttack", true);

      await pom.harness.dispatchEngine((engine) => {
        const choice = engine.getState().G.turnMetadata.pendingChoice;
        if (!choice || choice.type !== "gainGig") {
          throw new Error(`Expected P2 to choose a Gig, got ${choice?.type ?? "none"}.`);
        }
        engine.gainGig(choice.payload.allowedDieIds[0]!, { as: CYBERPUNK_P2 });
        engine.completeTurn({ as: CYBERPUNK_P2 });
      });
      await pom.expectFieldCardGrantedRule(
        CYBERPUNK_P2,
        forcedUnit.instanceId,
        "mustAttack",
        false,
      );

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});

function getCardRuleBadge(
  container: HTMLElement,
  cardId: string,
  rule: string,
): HTMLElement | null {
  const card = Array.from(container.querySelectorAll<HTMLElement>('[data-testid="card"]')).find(
    (candidate) => candidate.getAttribute("data-instance-id") === cardId,
  );
  return card?.querySelector<HTMLElement>(`[data-rule="${rule}"]`) ?? null;
}

function mustAttackBadgeLabel(container: HTMLElement, cardId: string): string {
  const badge = container.querySelector(`[data-entity-id="${cardId}"] [data-rule="mustAttack"]`);
  if (!badge) {
    throw new Error(`Missing mustAttack badge for ${cardId}.`);
  }
  return badge.getAttribute("aria-label") ?? "";
}
