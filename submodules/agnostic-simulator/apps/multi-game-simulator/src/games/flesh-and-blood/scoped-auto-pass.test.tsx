// @vitest-environment jsdom
import { MantineProvider } from "@mantine/core";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { decodeFabCommand, type FabMatchRuntime } from "@tcg/flesh-and-blood-engine/runtime";
import { CATALOG_TEST_DEFINITIONS, catalogIds } from "@tcg/flesh-and-blood-engine/simulator";
import {
  FabPriorityAutomationControl,
  FabPriorityAutomationQuickControl,
  FabPriorityAutomationSettings,
} from "./FabPriorityAutomation";
import { installBrowserShims } from "../../testing/browser-shims";

const PLAYER_2 = "player-2";

function renderWithMantine(ui: ReactElement) {
  return render(ui, { wrapper: MantineProvider });
}

beforeEach(() => {
  installBrowserShims();
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(
    new DOMRect(20, 20, 120, 32),
  );
  vi.spyOn(document.documentElement, "clientWidth", "get").mockReturnValue(1024);
  vi.spyOn(document.documentElement, "clientHeight", "get").mockReturnValue(768);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

/**
 * Drive a real attack to the defender's pass-only reaction window: the
 * attacker passes at the Reaction Step after the defender declares no
 * defense, handing the defender a window where passing is their only action.
 * Arming the combat scope through the UI must submit the engine command whose
 * receipt drains that window.
 */
function runtimeAtDefenderPassOnlyReactionWindow(): FabMatchRuntime {
  const fixture = FabTestEngine.create(
    {
      player1: {
        heroCardId: catalogIds.bravo,
        hand: [catalogIds.nimbleStrike],
        deck: 4,
        actionPoints: 1,
        resourcePoints: 1,
      },
      player2: { heroCardId: catalogIds.rhinar, hand: [], deck: 4 },
      cardDefinitions: CATALOG_TEST_DEFINITIONS,
    },
    { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
  );
  const game = fixture;
  game.as(catalogIds.bravo).playAttack(catalogIds.nimbleStrike);
  game.as(catalogIds.rhinar).pass();
  game.as(catalogIds.bravo).pass();
  const runtime = game.getRuntime();
  const state = runtime.getState();
  if (!state.combat?.open) throw new Error("Fixture failed to open combat.");
  if (state.priority?.holderPlayerId !== PLAYER_2) {
    throw new Error("Fixture failed to hand the defender a reaction window.");
  }
  return runtime;
}

describe("scoped auto-pass controls", () => {
  it("arming from the quick control submits the engine command and drains the window", () => {
    const runtime = runtimeAtDefenderPassOnlyReactionWindow();
    const onArmScope = vi.fn((scope: "combat" | "opponent-turn") => {
      const command = decodeFabCommand("set-automation-preferences", {
        armScopedAutoPass: scope,
      });
      expect(command).not.toBeNull();
      const result = runtime.applyCommand(PLAYER_2, command!);
      expect(result.success).toBe(true);
    });

    act(() => {
      renderWithMantine(
        <FabPriorityAutomationQuickControl
          mode="always-hold"
          scopedAutoPass={null}
          scopeContext={{ combatOpen: true, opponentsTurn: false }}
          onSelectMode={() => {}}
          onArmScope={onArmScope}
        />,
      );
    });
    fireEvent.click(screen.getByLabelText(/^Priority behavior:/));
    fireEvent.click(screen.getByTestId("fab-scoped-auto-pass-arm-combat"));

    expect(onArmScope).toHaveBeenCalledWith("combat");
    // The arm's command receipt drained the seat's pass-only window.
    expect(runtime.getState().priority?.holderPlayerId ?? "").not.toBe(PLAYER_2);
    expect(runtime.getState().automationPreferences[PLAYER_2]?.scopedAutoPass).toBe("combat");
  });

  it("the settings row arms inside its context and disarms while armed", () => {
    const onArmScope = vi.fn();
    const onDisarmScope = vi.fn();
    const { rerender } = renderWithMantine(
      <FabPriorityAutomationSettings
        mode="always-hold"
        scopedAutoPass={null}
        scopeContext={{ combatOpen: true, opponentsTurn: false }}
        onArmScope={onArmScope}
        onDisarmScope={onDisarmScope}
      />,
    );
    fireEvent.click(screen.getByTestId("fab-scoped-auto-pass-arm-combat"));
    expect(onArmScope).toHaveBeenCalledWith("combat");
    // Outside combat (and not the opponent's turn) no scope row is offered.
    rerender(
      <FabPriorityAutomationSettings
        mode="always-hold"
        scopedAutoPass={null}
        scopeContext={{ combatOpen: false, opponentsTurn: false }}
        onArmScope={onArmScope}
        onDisarmScope={onDisarmScope}
      />,
    );
    expect(screen.queryByTestId("fab-scoped-auto-pass-arm-combat")).toBeNull();

    rerender(
      <FabPriorityAutomationSettings
        mode="always-hold"
        scopedAutoPass="opponent-turn"
        scopeContext={{ combatOpen: false, opponentsTurn: false }}
        onArmScope={onArmScope}
        onDisarmScope={onDisarmScope}
      />,
    );
    fireEvent.click(screen.getByTestId("fab-scoped-auto-pass-disarm"));
    expect(onDisarmScope).toHaveBeenCalledTimes(1);
  });

  it("the armed chip announces the scope and cancels on click", () => {
    const onDisarmScope = vi.fn();
    renderWithMantine(
      <FabPriorityAutomationControl
        mode="always-hold"
        scopedAutoPass="combat"
        onDisarmScope={onDisarmScope}
      />,
    );
    const chip = screen.getByTestId("fab-scoped-auto-pass-chip");
    expect(chip.getAttribute("data-scope")).toBe("combat");
    fireEvent.click(screen.getByRole("button", { name: /Stop auto-passing this combat/i }));
    expect(onDisarmScope).toHaveBeenCalledTimes(1);
  });
});
