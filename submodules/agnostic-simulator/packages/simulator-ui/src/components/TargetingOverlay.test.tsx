// @vitest-environment jsdom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

import { TargetingOverlay } from "./TargetingOverlay";

describe("TargetingOverlay", () => {
  let root: Root | null = null;

  afterEach(() => {
    act(() => root?.unmount());
    root = null;
    document.body.innerHTML = "";
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  test("can preserve target affordances without dimming the board", () => {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect() {}
      },
    );
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      callback(0);
      return 1;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);

    const board = document.createElement("div");
    board.className = "board-mat";
    setRect(board, { left: 0, top: 0, width: 640, height: 400 });
    board.append(
      anchor("attacker", { left: 80, top: 260, width: 80, height: 112 }),
      anchor("target", { left: 480, top: 40, width: 80, height: 112 }),
    );
    const mount = document.createElement("div");
    board.append(mount);
    document.body.append(board);
    root = createRoot(mount);

    act(() => {
      root?.render(
        <TargetingOverlay
          showSpotlight={false}
          arrowColor="#ff3d5e"
          targetingIntents={[
            {
              id: "attack",
              sourceEntityId: "attacker",
              targetEntityIds: ["target"],
              targetZoneIds: [],
              preview: { label: "Target" },
            },
          ]}
        />,
      );
    });

    expect(document.querySelector(".targeting-overlay")).not.toBeNull();
    expect(document.querySelector(".targeting-spotlight")).toBeNull();
    expect(document.querySelector(".targeting-overlay-svg")).not.toBeNull();
    expect(
      Array.from(document.querySelectorAll(".targeting-overlay-svg path")).some(
        (path) => path.getAttribute("stroke") === "#ff3d5e",
      ),
    ).toBe(true);
    expect(document.querySelector(".targeting-preview-badge")?.textContent).toContain("Target");
  });
});

function anchor(entityId: string, rect: Partial<DOMRect>) {
  const element = document.createElement("div");
  element.dataset.entityId = entityId;
  setRect(element, rect);
  return element;
}

function setRect(element: HTMLElement, rect: Partial<DOMRect>) {
  element.getBoundingClientRect = () =>
    ({
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      right: 0,
      bottom: 0,
      x: 0,
      y: 0,
      toJSON: () => ({}),
      ...rect,
    }) as DOMRect;
}
