import { describe, test, vi } from "vite-plus/test";
import { fireEvent, waitFor } from "@testing-library/react";

vi.mock("../../../animation", async () => {
  const actual = await vi.importActual<typeof import("../../../animation")>("../../../animation");
  return { ...actual, SoundPlayer: () => null };
});

import {
  welcomeToNightCityRetailJackieWellesRideOrDieChoom,
  welcomeToNightCityRetailSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "../../cyberpunk-simulator-pom";
import { expectEqual } from "../../fixture-behaviors/cyberpunk-fixture-behavior";

import { ensureJsdomAnimationSupport } from "../../fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";

import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "../../render-cyberpunk-simulator";

describe("attackStep fixture behavior", () => {
  test.each(["Enter", " "])("keyboard %s activates a selectable fight target", async (key) => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "attackStep" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();

      const attacker = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailSwordwiseHuscle.id,
      );
      const defender = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        welcomeToNightCityRetailJackieWellesRideOrDieChoom.id,
      );
      const attackerElement = view.container.querySelector<HTMLElement>(
        `[data-entity-id="${attacker.instanceId}"]`,
      );
      const defenderElement = view.container.querySelector<HTMLElement>(
        `[data-entity-id="${defender.instanceId}"]`,
      );
      if (!attackerElement || !defenderElement) {
        throw new Error("Expected attack-step field cards to render.");
      }

      fireEvent.click(attackerElement);
      const fightAction = await waitFor(() => {
        const action = document.querySelector<HTMLButtonElement>(
          '[data-testid="card-context-menu"] [data-action-id^="attackUnit"]',
        );
        if (!action) throw new Error("Expected the attacker context menu to offer Fight.");
        return action;
      });
      fireEvent.click(fightAction);
      await waitFor(() => {
        expectEqual("fight target role", defenderElement.getAttribute("role"), "button");
        expectEqual("fight target focusable", defenderElement.getAttribute("tabindex"), "0");
      });

      fireEvent.keyDown(defenderElement, { key });

      await waitFor(async () => {
        const attack = await pom.getAttackState();
        expectEqual("keyboard attack kind", attack?.kind, "fight");
        expectEqual("keyboard attack attacker", attack?.attackerId, attacker.instanceId);
        expectEqual("keyboard attack defender", attack?.defenderId, defender.instanceId);
      });
    } finally {
      view.unmount();
    }
  });

  test("Main phase - attackers ready in jsdom", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "attackStep" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      expectEqual("attackStep phase", await pom.getPhase(), "main");
      expectEqual("attackStep active player", await pom.getActivePlayerId(), CYBERPUNK_P1);
      await pom.expectBoardMode(CYBERPUNK_P1, "select-action");
      await pom.expectBoardMode(CYBERPUNK_P2, "view");
      await pom.expectFieldSize(CYBERPUNK_P1, 2);
      await pom.expectFieldSize(CYBERPUNK_P2, 2);

      const attacker = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailSwordwiseHuscle.id,
      );
      const defender = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        welcomeToNightCityRetailJackieWellesRideOrDieChoom.id,
      );
      await pom.expectFieldCardSpent(CYBERPUNK_P1, attacker.instanceId, false);
      await pom.expectFieldCardSpent(CYBERPUNK_P2, defender.instanceId, true);

      await pom.attackUnit(attacker.instanceId, defender.instanceId, CYBERPUNK_P1);

      const attack = await pom.getAttackState();
      if (!attack) {
        throw new Error("Expected attack state after attacking a spent unit.");
      }
      expectEqual("attack kind", attack.kind, "fight");
      expectEqual("attack step", attack.step, "attack");
      expectEqual("attack attacker", attack.attackerId, attacker.instanceId);
      expectEqual("attack defender", attack.defenderId, defender.instanceId);
      expectEqual("attack rival", attack.rivalId, CYBERPUNK_P2);
      await pom.expectFieldCardSpent(CYBERPUNK_P1, attacker.instanceId, true);

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
