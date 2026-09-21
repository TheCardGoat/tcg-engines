import { WindowCyberpunkHarnessClient } from "../../window-cyberpunk-harness-client";
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
  describe.each(["desktop", "mobile"] as const)("target selection (%s)", (layout) => {
    test.each([
      ["Cancel attack button", "button"],
      ["Escape", "keyboard"],
      ["modal Cancel attack", "modal"],
      ["modal close then Cancel attack", "modal-close"],
      ["modal target", "modal-target"],
    ])("cancels attack target selection with the %s", async (_label, cancellation) => {
      ensureJsdomAnimationSupport();
      const view = renderCyberpunkSimulatorScenario({ scenarioId: "attackStep", layout });
      try {
        const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
        await new WindowCyberpunkHarnessClient().waitForReady();

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

        const cancelButton = await waitFor(() => {
          const button = view.container.querySelector<HTMLButtonElement>(
            '[data-testid="prompt-cancel-selection"]',
          );
          if (!button) throw new Error("Expected a visible attack cancellation control.");
          return button;
        });
        expectEqual("cancel attack label", cancelButton.textContent?.trim(), "Cancel attack");
        expectEqual(
          "fight target role before cancel",
          defenderElement.getAttribute("role"),
          "button",
        );

        expectEqual(
          "turn actions hidden during targeting",
          view.container.querySelector('[data-testid="prompt-banner-verbs"]'),
          null,
        );
        expectEqual(
          "target list initially closed",
          document.querySelector('[data-testid="choice-modal-sheet"]'),
          null,
        );
        if (cancellation.startsWith("modal")) {
          const showTargets = view.container.querySelector<HTMLButtonElement>(
            '[data-testid="prompt-target-modal-open"]',
          );
          if (!showTargets) throw new Error("Expected show targets button");
          fireEvent.click(showTargets);
          const modal = await waitFor(() => {
            const el = document.querySelector<HTMLElement>('[data-testid="choice-modal-sheet"]');
            if (!el) throw new Error("Expected target modal");
            return el;
          });
          expectEqual("attack not declared by opening modal", await pom.getAttackState(), null);
          const target = modal.querySelector<HTMLButtonElement>(
            `[data-testid="target-modal-card"][data-card-id="${defender.instanceId}"]`,
          );
          if (!target) throw new Error("Expected legal defender in modal");
          if (cancellation === "modal-target") {
            fireEvent.click(target);
            await waitFor(async () => {
              expectEqual(
                "modal attack defender",
                (await pom.getAttackState())?.defenderId,
                defender.instanceId,
              );
            });
            await pom.expectFieldCardSpent(CYBERPUNK_P1, attacker.instanceId, true);
            expectEqual(
              "modal closes after attack",
              document.querySelector('[data-testid="choice-modal-sheet"]'),
              null,
            );
            return;
          }
          if (cancellation === "modal-close") {
            fireEvent.keyDown(window, { key: "Escape" });
            await waitFor(() =>
              expectEqual(
                "modal closed",
                document.querySelector('[data-testid="choice-modal-sheet"]'),
                null,
              ),
            );
            expectEqual("board targeting remains", defenderElement.getAttribute("role"), "button");
            fireEvent.click(cancelButton);
          } else {
            const cancel = modal.querySelector<HTMLButtonElement>(
              '[data-testid="target-modal-cancel-selection"]',
            );
            if (!cancel) throw new Error("Expected modal cancel attack");
            fireEvent.click(cancel);
          }
        } else if (cancellation === "button") {
          fireEvent.click(cancelButton);
        } else {
          fireEvent.keyDown(window, { key: "Escape" });
        }

        await waitFor(() => {
          expectEqual("fight target role after cancel", defenderElement.getAttribute("role"), null);
          expectEqual(
            "cancel control removed after cancel",
            view.container.querySelector('[data-testid="prompt-cancel-selection"]'),
            null,
          );
        });
        expectEqual("attack remains undeclared", await pom.getAttackState(), null);
        await pom.expectFieldCardSpent(CYBERPUNK_P1, attacker.instanceId, false);
      } finally {
        view.unmount();
      }
    });
  });

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
