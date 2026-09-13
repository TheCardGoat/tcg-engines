// @vitest-environment jsdom
import { MantineProvider } from "@mantine/core";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  FAB_PRIORITY_MODE_ACTION_LABEL,
  FAB_PRIORITY_MODES,
} from "@tcg/flesh-and-blood-server-adapter";
import {
  FabBoardContextMenu,
  FabPriorityAutomationControl,
  FabPriorityAutomationParticipantMenu,
  FabPriorityAutomationQuickControl,
  FabPriorityAutomationSettings,
} from "./FabPriorityAutomation";
import type { FabPriorityAutomationMode } from "./state";
import { installBrowserShims } from "../../testing/browser-shims";

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

describe("FabPriorityAutomationSettings", () => {
  it("presents all persistent modes and submits a new selection", () => {
    const onSelectMode = vi.fn();
    render(<FabPriorityAutomationSettings mode="always-hold" onSelectMode={onSelectMode} />);

    const group = screen.getByRole("radiogroup", { name: "Priority mode" });
    expect(group).toBeTruthy();
    for (const mode of FAB_PRIORITY_MODES) {
      const radio = screen.getByTestId(`fab-priority-mode-${mode}`);
      expect(radio.getAttribute("role")).toBe("radio");
      expect(radio.getAttribute("aria-checked")).toBe(mode === "always-hold" ? "true" : "false");
      expect(radio.getAttribute("aria-label")).toBe(FAB_PRIORITY_MODE_ACTION_LABEL[mode]);
    }

    fireEvent.click(screen.getByTestId("fab-priority-mode-play-and-skip"));
    expect(onSelectMode).toHaveBeenCalledWith("play-and-skip");
    fireEvent.click(screen.getByTestId("fab-priority-mode-always-hold"));
    expect(onSelectMode).not.toHaveBeenCalledWith("always-hold");
  });

  it("offers Hold next only for an eligible Play & skip window", () => {
    const onArmHold = vi.fn();
    const { rerender } = render(
      <FabPriorityAutomationSettings
        mode="play-and-skip"
        holdsPriority
        onSelectMode={() => {}}
        onArmHold={onArmHold}
      />,
    );
    fireEvent.click(screen.getByTestId("fab-priority-hold-arm"));
    expect(onArmHold).toHaveBeenCalledTimes(1);

    rerender(
      <FabPriorityAutomationSettings
        mode="auto-pass"
        holdsPriority
        onSelectMode={() => {}}
        onArmHold={onArmHold}
      />,
    );
    expect(screen.queryByTestId("fab-priority-hold-arm")).toBeNull();
  });

  it("renders the auto-order switch and submits toggles", () => {
    const onSetAutoOrderTriggers = vi.fn();
    render(
      <FabPriorityAutomationSettings
        mode="always-hold"
        onSelectMode={() => {}}
        autoOrderTriggers={false}
        onSetAutoOrderTriggers={onSetAutoOrderTriggers}
      />,
    );

    const toggle = screen.getByTestId("fab-auto-order-triggers");
    expect(toggle.getAttribute("role")).toBe("switch");
    expect(toggle.getAttribute("aria-checked")).toBe("false");

    fireEvent.click(toggle);
    expect(onSetAutoOrderTriggers).toHaveBeenCalledWith(true);
  });

  it("renders the auto-select switch and submits toggles", () => {
    const onSetAutoSelectSingletonTargets = vi.fn();
    render(
      <FabPriorityAutomationSettings
        mode="always-hold"
        onSelectMode={() => {}}
        autoSelectSingletonTargets
        onSetAutoSelectSingletonTargets={onSetAutoSelectSingletonTargets}
      />,
    );

    const toggle = screen.getByTestId("fab-auto-select-singleton-targets");
    expect(toggle.getAttribute("role")).toBe("switch");
    expect(toggle.getAttribute("aria-checked")).toBe("true");

    fireEvent.click(toggle);
    expect(onSetAutoSelectSingletonTargets).toHaveBeenCalledWith(false);
  });

  it("starts keyboard focus on the checked radio (roving tabindex)", () => {
    render(<FabPriorityAutomationSettings mode="play-and-skip" onSelectMode={() => {}} />);
    expect(
      (screen.getByTestId("fab-priority-mode-play-and-skip") as HTMLButtonElement).tabIndex,
    ).toBe(0);
    for (const mode of FAB_PRIORITY_MODES.filter((candidate) => candidate !== "play-and-skip")) {
      expect((screen.getByTestId(`fab-priority-mode-${mode}`) as HTMLButtonElement).tabIndex).toBe(
        -1,
      );
    }
  });

  it("arrow keys move focus and selection through the mode cycle", () => {
    const onSelectMode = vi.fn();
    const { rerender } = render(
      <FabPriorityAutomationSettings mode={FAB_PRIORITY_MODES[0]} onSelectMode={onSelectMode} />,
    );
    const radios = FAB_PRIORITY_MODES.map(
      (mode) => screen.getByTestId(`fab-priority-mode-${mode}`) as HTMLButtonElement,
    );
    // Follow each selection like the engine round-trip would, so wrapping
    // back to the (now previous) first mode is a real selection change.
    const follow = (mode: FabPriorityAutomationMode) =>
      rerender(<FabPriorityAutomationSettings mode={mode} onSelectMode={onSelectMode} />);

    radios[0].focus();
    fireEvent.keyDown(radios[0], { key: "ArrowRight" });
    expect(onSelectMode).toHaveBeenCalledWith(FAB_PRIORITY_MODES[1]);
    expect(document.activeElement).toBe(radios[1]);
    follow(FAB_PRIORITY_MODES[1]);

    fireEvent.keyDown(radios[1], { key: "ArrowRight" });
    expect(onSelectMode).toHaveBeenCalledWith(FAB_PRIORITY_MODES[2]);
    expect(document.activeElement).toBe(radios[2]);
    follow(FAB_PRIORITY_MODES[2]);

    // The cycle wraps focus and selection back to the first mode.
    fireEvent.keyDown(radios[2], { key: "ArrowRight" });
    expect(onSelectMode).toHaveBeenCalledWith(FAB_PRIORITY_MODES[0]);
    expect(document.activeElement).toBe(radios[0]);
    follow(FAB_PRIORITY_MODES[0]);

    // ArrowLeft mirrors back through the cycle (wrap included).
    fireEvent.keyDown(radios[0], { key: "ArrowLeft" });
    expect(onSelectMode).toHaveBeenCalledWith(FAB_PRIORITY_MODES[2]);
    expect(document.activeElement).toBe(radios[2]);
    expect(onSelectMode).toHaveBeenCalledTimes(4);
  });

  it("explains and disables unavailable match settings", () => {
    const reason = "Wait for your priority window to change this setting.";
    render(<FabPriorityAutomationSettings mode="always-hold" disabledReason={reason} />);
    expect(screen.getByText(reason)).toBeTruthy();
    for (const mode of FAB_PRIORITY_MODES) {
      expect((screen.getByTestId(`fab-priority-mode-${mode}`) as HTMLButtonElement).disabled).toBe(
        true,
      );
    }
  });

  it("turns automatic simultaneous-trigger ordering on and off in Game settings", () => {
    const onSetAutoOrderTriggers = vi.fn();
    const { rerender } = render(
      <FabPriorityAutomationSettings
        mode="always-hold"
        autoOrderTriggers={false}
        onSelectMode={() => {}}
        onSetAutoOrderTriggers={onSetAutoOrderTriggers}
      />,
    );
    const control = screen.getByTestId("fab-auto-order-triggers");
    expect(control.getAttribute("role")).toBe("switch");
    expect(control.getAttribute("aria-checked")).toBe("false");
    expect(control.getAttribute("title")).toContain("Turn this off here in Game settings");
    fireEvent.click(control);
    expect(onSetAutoOrderTriggers).toHaveBeenCalledWith(true);

    rerender(
      <FabPriorityAutomationSettings
        mode="always-hold"
        autoOrderTriggers
        onSelectMode={() => {}}
        onSetAutoOrderTriggers={onSetAutoOrderTriggers}
      />,
    );
    fireEvent.click(screen.getByTestId("fab-auto-order-triggers"));
    expect(onSetAutoOrderTriggers).toHaveBeenCalledWith(false);
  });
});

describe("FabPriorityAutomationControl", () => {
  it("is absent outside an active pass countdown", () => {
    const { container } = render(<FabPriorityAutomationControl mode="always-hold" />);
    expect(container.firstChild).toBeNull();
  });

  it("shows one Hold action, drains, and cancels the active countdown", () => {
    vi.useFakeTimers();
    try {
      const onCancel = vi.fn();
      render(
        <FabPriorityAutomationControl
          mode="always-hold"
          countdown={{ windowKey: "p1:10:req-1", durationMs: 5000, onCancel }}
        />,
      );
      const control = screen.getByTestId("fab-priority-automation-toggle");
      expect(control.getAttribute("data-window-key")).toBe("p1:10:req-1");
      expect(screen.queryByTestId("fab-priority-mode-auto-pass")).toBeNull();
      expect(
        screen.getByRole("button", { name: "Hold priority; passing in 5 seconds" }),
      ).toBeTruthy();
      void act(() => vi.advanceTimersByTime(3000));
      fireEvent.click(screen.getByRole("button", { name: "Hold priority; passing in 2 seconds" }));
      expect(onCancel).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it("does not countdown in Auto-pass mode", () => {
    const { container } = render(
      <FabPriorityAutomationControl
        mode="auto-pass"
        countdown={{ windowKey: "p1:12:req-3", durationMs: 5000, onCancel: () => {} }}
      />,
    );
    expect(container.firstChild).toBeNull();
  });
});

describe("FabPriorityAutomationQuickControl", () => {
  it("changes mode from the compact participant control and explains the current mode", async () => {
    const onSelectMode = vi.fn();
    renderWithMantine(
      <FabPriorityAutomationQuickControl
        mode="play-and-skip"
        onSelectMode={onSelectMode}
        onArmHold={() => {}}
      />,
    );

    const trigger = screen.getByRole("button", { name: "Priority behavior: Play & skip" });
    fireEvent.pointerEnter(trigger);
    expect(screen.getByRole("tooltip").textContent).toContain(
      "Skip your immediate follow-up window",
    );
    fireEvent.click(trigger);
    fireEvent.click(await screen.findByTestId("fab-priority-menu-mode-always-hold"));
    expect(onSelectMode).toHaveBeenCalledWith("always-hold");
  });

  it("toggles automatic trigger ordering inside the priority popover", async () => {
    const onSetAutoOrderTriggers = vi.fn();
    const onParentClick = vi.fn();
    const { rerender } = renderWithMantine(
      <div onClick={onParentClick}>
        <FabPriorityAutomationQuickControl
          mode="always-hold"
          autoOrderTriggers={false}
          onSelectMode={() => {}}
          onSetAutoOrderTriggers={onSetAutoOrderTriggers}
        />
      </div>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Priority behavior: Hold priority" }));
    onParentClick.mockClear();
    const checkbox = await screen.findByTestId("fab-priority-menu-auto-order-triggers");
    expect(screen.getByRole("group", { name: "Related option" }).contains(checkbox)).toBe(true);
    expect(checkbox.getAttribute("role")).toBe("menuitemcheckbox");
    expect(checkbox.getAttribute("aria-checked")).toBe("false");
    expect(checkbox.getAttribute("title")).toBe(
      "Use the listed order for simultaneous triggers you control.",
    );
    fireEvent.click(checkbox);
    expect(onSetAutoOrderTriggers).toHaveBeenCalledWith(true);
    expect(onParentClick).not.toHaveBeenCalled();
    expect(screen.getByRole("menu", { name: "Priority behavior" })).toBeTruthy();

    rerender(
      <div onClick={onParentClick}>
        <FabPriorityAutomationQuickControl
          mode="auto-pass"
          autoOrderTriggers
          onSelectMode={() => {}}
          onSetAutoOrderTriggers={onSetAutoOrderTriggers}
        />
      </div>,
    );
    fireEvent.click(screen.getByTestId("fab-priority-menu-auto-order-triggers"));
    expect(onSetAutoOrderTriggers).toHaveBeenCalledWith(false);
  });

  it("portals the priority menu outside the clipped participant control", async () => {
    renderWithMantine(
      <FabPriorityAutomationQuickControl
        mode="play-and-skip"
        onSelectMode={() => {}}
        onArmHold={() => {}}
      />,
    );
    const quickActions = screen.getByTestId("fab-priority-quick-control");
    fireEvent.click(screen.getByRole("button", { name: "Priority behavior: Play & skip" }));

    const menu = await screen.findByRole("menu", { name: "Priority behavior" });
    expect(quickActions.contains(menu)).toBe(false);

    fireEvent.keyDown(menu, { key: "Escape" });
    expect(screen.queryByRole("menu", { name: "Priority behavior" })).toBeNull();
  });

  it("offers the one-shot hold only in Play & skip mode", () => {
    const onArmHold = vi.fn();
    const { rerender } = renderWithMantine(
      <FabPriorityAutomationQuickControl
        mode="play-and-skip"
        onSelectMode={() => {}}
        onArmHold={onArmHold}
      />,
    );
    const quickActions = screen.getByTestId("fab-priority-quick-control");
    const actionButtons = quickActions.querySelectorAll("button");
    expect(actionButtons[0]).toBe(screen.getByTestId("fab-priority-quick-hold-next"));
    expect(actionButtons[1]).toBe(
      screen.getByRole("button", { name: "Priority behavior: Play & skip" }),
    );
    fireEvent.click(screen.getByTestId("fab-priority-quick-hold-next"));
    expect(onArmHold).toHaveBeenCalledTimes(1);

    rerender(
      <FabPriorityAutomationQuickControl
        mode="always-hold"
        onSelectMode={() => {}}
        onArmHold={onArmHold}
      />,
    );
    expect(screen.queryByTestId("fab-priority-quick-hold-next")).toBeNull();
  });
});

describe("priority action menus", () => {
  it("nests priority behavior in the participant menu", () => {
    const onSelectMode = vi.fn();
    render(<FabPriorityAutomationParticipantMenu mode="auto-pass" onSelectMode={onSelectMode} />);
    fireEvent.click(screen.getByRole("menuitem", { name: /Priority behavior/ }));
    fireEvent.click(screen.getByTestId("fab-priority-menu-mode-play-and-skip"));
    expect(onSelectMode).toHaveBeenCalledWith("play-and-skip");
  });

  it("provides the same nested mode controls from the board context menu", () => {
    const onSelectMode = vi.fn();
    render(
      <FabBoardContextMenu
        x={120}
        y={160}
        mode="always-hold"
        onSelectMode={onSelectMode}
        onClose={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole("menuitem", { name: /Priority behavior/ }));
    fireEvent.click(screen.getByTestId("fab-priority-menu-mode-auto-pass"));
    expect(onSelectMode).toHaveBeenCalledWith("auto-pass");
  });
});
