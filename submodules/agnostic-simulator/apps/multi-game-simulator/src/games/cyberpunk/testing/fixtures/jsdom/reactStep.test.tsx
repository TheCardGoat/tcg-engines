import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vite-plus/test";

vi.mock("../../../animation", async () => {
  const actual = await vi.importActual<typeof import("../../../animation")>("../../../animation");
  return { ...actual, SoundPlayer: () => null };
});

import {
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailSecondhandBombus,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "../../cyberpunk-simulator-pom";
import { expectEqual } from "../../fixture-behaviors/cyberpunk-fixture-behavior";

import { ensureJsdomAnimationSupport } from "../../fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";

import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "../../render-cyberpunk-simulator";

describe("reactStep fixture behavior", () => {
  test("asks before the defender skips a valid blocker", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "reactStep" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();

      const [skipBlock] = await screen.findAllByTestId("phase-advance");
      expect(skipBlock).toBeTruthy();
      expect(skipBlock.textContent).toMatch(/skip/i);

      fireEvent.click(skipBlock);

      expect(skipBlock.textContent).toMatch(/are you sure/i);
      expect(screen.queryByRole("dialog", { name: "Skip your chance to block?" })).toBeNull();
      expect((await pom.getAttackState())?.step).toBe("react");

      fireEvent.click(skipBlock);

      await waitFor(async () => {
        expect((await pom.getAttackState())?.step).not.toBe("react");
      });
    } finally {
      view.unmount();
    }
  });

  test("requires two Space presses to skip a valid blocker", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "reactStep" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();

      fireEvent.keyDown(window, { key: " ", code: "Space" });

      const armedSkipBlock = screen
        .getAllByTestId("phase-advance")
        .find((button) => /are you sure/i.test(button.textContent ?? ""));
      expect(armedSkipBlock).toBeTruthy();
      expect(screen.queryByRole("dialog", { name: "Skip your chance to block?" })).toBeNull();
      expect((await pom.getAttackState())?.step).toBe("react");

      fireEvent.keyDown(window, { key: " ", code: "Space" });

      await waitFor(async () => {
        expect((await pom.getAttackState())?.step).not.toBe("react");
      });
    } finally {
      view.unmount();
    }
  });

  test("React - block decision in jsdom", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "reactStep" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      expectEqual("reactStep phase", await pom.getPhase(), "main");
      expectEqual("reactStep active player", await pom.getActivePlayerId(), CYBERPUNK_P2);
      await pom.expectBoardMode(CYBERPUNK_P1, "select-action");
      await pom.expectBoardMode(CYBERPUNK_P2, "view");
      await pom.expectGigCount(CYBERPUNK_P1, 0);
      await pom.expectGigCount(CYBERPUNK_P2, 1);

      const attacker = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        embracingPowerRetailStarterDeckMinotaur.id,
      );
      const blocker = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailSecondhandBombus.id,
      );
      const remainingBlocker = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailCorpoSecurity.id,
      );
      const initialAttack = await pom.getAttackState();
      if (!initialAttack) {
        throw new Error("Expected reactStep to start in an attack.");
      }
      expectEqual("initial attack kind", initialAttack.kind, "direct");
      expectEqual("initial attack step", initialAttack.step, "react");
      expectEqual("initial attacker", initialAttack.attackerId, attacker.instanceId);
      expectEqual("initial defender", initialAttack.defenderId, null);
      await pom.expectFieldCardSpent(CYBERPUNK_P1, blocker.instanceId, false);

      const blockerCard = view.container.querySelector<HTMLElement>(
        `[data-testid="card"][data-instance-id="${blocker.instanceId}"]`,
      );
      if (!blockerCard) {
        throw new Error("Expected the ready blocker to be rendered.");
      }
      fireEvent.click(blockerCard);

      expect(document.body.querySelector("[data-card-context-menu]")).toBeNull();

      const blockedAttack = await pom.getAttackState();
      if (!blockedAttack) {
        throw new Error("Expected attack state after using a blocker.");
      }
      expectEqual("blocked attack kind", blockedAttack.kind, "fight");
      expectEqual("blocked attack step", blockedAttack.step, "react");
      expectEqual("blocked attack defender", blockedAttack.defenderId, blocker.instanceId);
      expectEqual("blocked attack redirected", blockedAttack.redirectedByBlocker, true);
      await pom.expectFieldCardSpent(CYBERPUNK_P1, blocker.instanceId, true);
      await pom.expectFieldCardSpent(CYBERPUNK_P1, remainingBlocker.instanceId, false);
      await pom.expectGigCount(CYBERPUNK_P1, 0);
      await pom.expectGigCount(CYBERPUNK_P2, 1);

      const [continueAttack] = screen.getAllByTestId("phase-advance");
      expect(continueAttack).toBeTruthy();
      expect(continueAttack.textContent).toMatch(/resolve/i);
      fireEvent.click(continueAttack);

      expect(
        screen
          .queryAllByTestId("phase-advance")
          .some((button) => /are you sure/i.test(button.textContent ?? "")),
      ).toBe(false);
      await waitFor(async () => {
        expect((await pom.getAttackState())?.step).not.toBe("react");
      });

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
