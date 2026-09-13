// @vitest-environment jsdom
import { act, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

import {
  SimulatorViewportRailPortal,
  SimulatorViewportSidebarToolsProvider,
  SimulatorViewportShell,
  useSimulatorViewportLayout,
} from "./SimulatorViewportShell";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

let root: Root | null = null;
let container: HTMLDivElement | null = null;

function setViewport(width: number, height = 900, coarse = false) {
  Object.defineProperty(window, "innerWidth", { configurable: true, value: width });
  Object.defineProperty(window, "innerHeight", { configurable: true, value: height });
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn((query: string) => ({
      matches: coarse && query === "(pointer: coarse)",
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
}

function LayoutProbe() {
  return <output data-testid="layout-probe">{useSimulatorViewportLayout()}</output>;
}

function StatefulTabletopProbe() {
  const [count, setCount] = useState(0);
  return (
    <button
      type="button"
      data-testid="stateful-tabletop"
      onClick={() => setCount((value) => value + 1)}
    >
      Tabletop state {count}
    </button>
  );
}

function renderShell(layoutOverride?: "desktop" | "mobile") {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() =>
    root?.render(
      <SimulatorViewportSidebarToolsProvider
        tools={<button type="button">Export debug JSON</button>}
      >
        <SimulatorViewportShell
          layoutOverride={layoutOverride}
          sidebar={
            <div>
              Sidebar content
              <button type="button">Sidebar action</button>
            </div>
          }
          mobilePanel={
            <div>
              Activity content
              <button type="button">Activity action</button>
            </div>
          }
          mobileTopRail={({ openSidebar }) => (
            <button type="button" onClick={openSidebar}>
              Open panel
            </button>
          )}
          mobileBottomRail={<div>Player actions</div>}
          tabletop={
            <>
              <LayoutProbe />
              <div>Tabletop</div>
            </>
          }
        />
      </SimulatorViewportSidebarToolsProvider>,
    ),
  );
}

afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
  root = null;
  container = null;
});

describe("SimulatorViewportShell", () => {
  test.each([
    [320, "mobile"],
    [390, "mobile"],
    [767, "mobile"],
    [768, "desktop"],
    [1024, "desktop"],
    [1440, "desktop"],
    [3840, "desktop"],
  ] as const)("selects %spx as %s", (width, expectedLayout) => {
    setViewport(width);
    renderShell();
    expect(container!.querySelector("[data-active-shell]")?.getAttribute("data-layout")).toBe(
      expectedLayout,
    );
  });

  test("starts expanded on desktop and collapses without reserving a secondary rail", () => {
    setViewport(768);
    renderShell();
    const shell = container!.querySelector("[data-active-shell]")!;
    expect(shell.getAttribute("data-layout")).toBe("desktop");
    expect(shell.getAttribute("data-sidebar-open")).toBe("true");
    expect(container!.querySelector('[aria-label="Simulator panel controls"]')).toBeNull();
    expect(container!.querySelector('[aria-label="Collapse sidebar"]')).not.toBeNull();
    expect(container!.querySelector('[aria-label="Simulator debug tools"]')?.textContent).toContain(
      "Export debug JSON",
    );
    act(() => (container!.querySelector('[aria-label="Collapse sidebar"]') as HTMLElement).click());
    expect(container!.querySelector("[data-active-shell]")?.getAttribute("data-sidebar-open")).toBe(
      "false",
    );
    expect(container!.textContent).not.toContain("Sidebar content");
    expect(container!.querySelector('[aria-label="Simulator panel controls"]')).toBeNull();
    expect(container!.querySelector('[aria-label="Expand sidebar"]')).not.toBeNull();
  });

  test("honors an explicit desktop layout override and exposes it to board content", () => {
    setViewport(320);
    renderShell("desktop");
    expect(container!.querySelector("[data-active-shell]")?.getAttribute("data-layout")).toBe(
      "desktop",
    );
    expect(container!.querySelector('[data-testid="layout-probe"]')?.textContent).toBe("desktop");
  });

  test("honors an explicit mobile layout override and exposes it to board content", () => {
    setViewport(1440);
    renderShell("mobile");
    expect(container!.querySelector("[data-active-shell]")?.getAttribute("data-layout")).toBe(
      "mobile",
    );
    expect(container!.querySelector('[data-testid="layout-probe"]')?.textContent).toBe("mobile");
  });

  test("preserves tabletop state when the responsive layout changes", () => {
    setViewport(320);
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    const renderAt = (layoutOverride: "desktop" | "mobile") =>
      root?.render(
        <SimulatorViewportShell
          layoutOverride={layoutOverride}
          sidebar={<div>Sidebar</div>}
          mobilePanel={<div>Activity</div>}
          tabletop={<StatefulTabletopProbe />}
        />,
      );

    act(() => renderAt("mobile"));
    const probe = container.querySelector<HTMLButtonElement>('[data-testid="stateful-tabletop"]')!;
    act(() => probe.click());
    expect(probe.textContent).toBe("Tabletop state 1");

    act(() => renderAt("desktop"));
    const desktopProbe = container.querySelector<HTMLButtonElement>(
      '[data-testid="stateful-tabletop"]',
    )!;
    expect(desktopProbe).toBe(probe);
    expect(desktopProbe.textContent).toBe("Tabletop state 1");
  });

  test("uses rails and a dedicated activity drawer on phones", () => {
    setViewport(390);
    renderShell();
    expect(container!.querySelector("[data-active-shell]")?.getAttribute("data-layout")).toBe(
      "mobile",
    );
    expect(container!.textContent).toContain("Player actions");
    const openButton = container!.querySelector("header button") as HTMLButtonElement;
    openButton.focus();
    act(() => openButton.click());
    expect(container!.querySelector('[role="dialog"]')?.textContent).toContain("Activity content");
    expect(container!.querySelector('[role="dialog"]')?.textContent).toContain("Export debug JSON");
    expect(container!.querySelector('[role="dialog"]')?.textContent).not.toContain(
      "Sidebar content",
    );
    expect(document.activeElement?.textContent).toBe("Close");
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", shiftKey: true }));
    });
    expect(document.activeElement?.textContent).toBe("Export debug JSON");
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));
    });
    expect(document.activeElement?.textContent).toBe("Close");
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    expect(container!.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(openButton);
  });

  test("treats a short coarse-pointer landscape as mobile and accepts game-owned rail portals", () => {
    setViewport(900, 500, true);
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    act(() =>
      root?.render(
        <SimulatorViewportShell
          sidebar={<div>Sidebar</div>}
          mobilePanel={<div>Activity</div>}
          tabletop={
            <>
              <SimulatorViewportRailPortal position="top">
                Opponent rail
              </SimulatorViewportRailPortal>
              <SimulatorViewportRailPortal position="bottom">
                Player rail
              </SimulatorViewportRailPortal>
              <div>Board</div>
            </>
          }
        />,
      ),
    );
    expect(container!.querySelector("[data-active-shell]")?.getAttribute("data-layout")).toBe(
      "mobile",
    );
    expect(container!.textContent).toContain("Opponent rail");
    expect(container!.textContent).toContain("Player rail");
  });
});
