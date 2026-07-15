// @vitest-environment jsdom
import { act } from "react";
import type { ComponentProps } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

import { AiControlPanel } from "./AiControlPanel";
import classes from "./AiControlPanel.module.css";

let activeRoot: Root | null = null;
let activeContainer: HTMLDivElement | null = null;

afterEach(() => {
  if (activeRoot) {
    act(() => activeRoot?.unmount());
  }
  activeContainer?.remove();
  activeRoot = null;
  activeContainer = null;
});

function renderPanel(props: Partial<ComponentProps<typeof AiControlPanel>> = {}): HTMLDivElement {
  activeContainer = document.createElement("div");
  document.body.append(activeContainer);
  activeRoot = createRoot(activeContainer);
  act(() =>
    activeRoot?.render(
      <AiControlPanel
        mode="auto"
        speed="balanced"
        status="waiting"
        side="opponent"
        strategies={[{ id: "default", label: "Default" }]}
        selectedStrategyId="default"
        onChangeMode={vi.fn()}
        onChangeSpeed={vi.fn()}
        onChangeStrategy={vi.fn()}
        onTakeControl={vi.fn()}
        {...props}
      />,
    ),
  );
  return activeContainer;
}

describe("AiControlPanel", () => {
  test("renders compact embedded controls without the AI decision table when hidden", () => {
    const container = renderPanel({ compact: true, embedded: true, hideDecisionLog: true });
    const panel = container.querySelector('[data-testid="ai-control-panel"]');

    expect(panel).toBeInstanceOf(HTMLElement);
    expect(panel?.classList.contains(classes.panelCompact ?? "")).toBe(true);
    expect(panel?.classList.contains(classes.panelEmbedded ?? "")).toBe(true);
    expect(container.querySelector('[data-testid="ai-log-entry"]')).toBeNull();
    expect(container.textContent).not.toContain("AI decisions");
    expect(container.querySelector('[data-testid="ai-speed-balanced"]')).toBeInstanceOf(
      HTMLButtonElement,
    );
    expect(container.querySelector('[data-testid="ai-speed-balanced"]')?.textContent).toBe(
      "Normal",
    );
    expect(container.querySelector('[data-testid="ai-mode-auto"]')).toBeInstanceOf(
      HTMLButtonElement,
    );
  });

  test("keeps takeover disabled after the game is done", () => {
    const container = renderPanel({ status: "done" });
    const takeControl = container.querySelector('[data-testid="ai-take-control"]');

    expect(takeControl).toBeInstanceOf(HTMLButtonElement);
    expect((takeControl as HTMLButtonElement | null)?.disabled).toBe(true);
  });
});
