// @vitest-environment jsdom

import type { SimulatorCombatIntent } from "@tcg/simulator-contract";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test, vi } from "vite-plus/test";

import { CombatIntentOverlay } from "./CombatIntentOverlay";

let root: Root | null = null;
let mount: HTMLDivElement | null = null;
let triggerMutation: (() => void) | null = null;
let resizeObserverConstructions = 0;
let resizeObserverDisconnections = 0;

const declaredIntent: SimulatorCombatIntent = {
  id: "combat-1",
  attackerEntityId: "attacker",
  declaredTarget: { kind: "entity", id: "original" },
  currentTarget: { kind: "entity", id: "original" },
  phase: "declared",
  attackKind: "fight",
  declaredTargetLabel: "Attack target",
  ariaLabel: "Attacker attacks Original.",
};

describe("CombatIntentOverlay", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor() {
          resizeObserverConstructions += 1;
        }
        observe() {}
        disconnect() {
          resizeObserverDisconnections += 1;
        }
      },
    );
    vi.stubGlobal(
      "MutationObserver",
      class {
        constructor(callback: MutationCallback) {
          triggerMutation = () => callback([], this as unknown as MutationObserver);
        }
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
    setRect(board, { left: 0, top: 0, width: 600, height: 400 });
    board.append(
      anchor("attacker", { left: 80, top: 250, width: 80, height: 112 }),
      anchor("original", { left: 430, top: 80, width: 80, height: 112 }),
      anchor("blocker", { left: 310, top: 210, width: 80, height: 112 }),
    );
    mount = document.createElement("div");
    board.append(mount);
    document.body.append(board);
    root = createRoot(mount);
    resizeObserverConstructions = 0;
    resizeObserverDisconnections = 0;
  });

  afterEach(() => {
    act(() => root?.unmount());
    root = null;
    mount = null;
    triggerMutation = null;
    document.body.innerHTML = "";
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  test("keeps a declared attack visible from projected combat state", () => {
    render(declaredIntent);

    const overlay = document.querySelector<HTMLElement>('[data-testid="combat-intent-overlay"]');
    expect(overlay?.getAttribute("data-combat-phase")).toBe("declared");
    expect(overlay?.style.zIndex).toBe("402");
    expect(overlay?.getAttribute("data-original-target-ref")).toBe("entity:original");
    expect(document.querySelectorAll('[data-combat-segment-role="attack"]')).toHaveLength(1);
    expect(document.querySelectorAll('[data-combat-segment-role="redirect"]')).toHaveLength(0);
    expect(document.querySelector('[data-targeting-arrow-variant="attack"]')).not.toBeNull();
    expect(document.querySelector('[role="status"]')?.textContent).toContain(
      "Attacker attacks Original",
    );
  });

  test("keeps combat geometry anchored to a scrolled board viewport", () => {
    const board = document.querySelector<HTMLElement>(".board-mat")!;
    board.scrollTop = 120;
    board.scrollLeft = 16;

    render(declaredIntent);

    expect(
      document.querySelector<HTMLElement>('[data-testid="combat-intent-overlay"]')?.style.transform,
    ).toBe("translate(16px, 120px)");
  });

  test("preserves the original route and adds a committed redirect", () => {
    render({
      ...declaredIntent,
      currentTarget: { kind: "entity", id: "blocker" },
      phase: "redirected",
      declaredTargetLabel: "Original target · protected",
      currentTargetLabel: "Now attacks · Blocker",
      ariaLabel: "Blocker protects Original.",
    });

    expect(document.querySelectorAll('[data-combat-segment-role="attack"]')).toHaveLength(1);
    expect(document.querySelectorAll('[data-combat-segment-role="redirect"]')).toHaveLength(1);
    expect(document.querySelector('[data-targeting-arrow-variant="history"]')).not.toBeNull();
    expect(document.querySelector('[data-targeting-arrow-variant="redirect"]')).not.toBeNull();
    expect(
      document.querySelector('[data-combat-segment-role="redirect"] path')?.getAttribute("d"),
    ).toBe("M 120 306 L 350 266");
    expect(document.querySelector('[data-testid="combat-intent-attack-label"]')?.textContent).toBe(
      "Original target · protected",
    );
    expect(
      document.querySelector('[data-testid="combat-intent-redirect-label"]')?.textContent,
    ).toBe("Now attacks · Blocker");
  });

  test("falls back to attacker-to-current-target when the original anchor is missing", () => {
    document.querySelector('[data-sim-entity-id="original"]')?.remove();
    render({
      ...declaredIntent,
      currentTarget: { kind: "entity", id: "blocker" },
      phase: "redirected",
    });

    expect(
      document
        .querySelector('[data-testid="combat-intent-overlay"]')
        ?.getAttribute("data-route-fallback"),
    ).toBe("true");
    expect(document.querySelectorAll('[data-combat-segment-role="attack"]')).toHaveLength(0);
    expect(document.querySelectorAll('[data-combat-segment-role="redirect"]')).toHaveLength(1);
  });

  test("tracks replacement endpoint elements after a board rerender", () => {
    render(declaredIntent);
    const segmentBeforeRerender = document.querySelector('[data-combat-segment-role="attack"]');

    act(() => {
      document
        .querySelector('[data-sim-entity-id="original"]')
        ?.replaceWith(anchor("original", { left: 250, top: 40, width: 80, height: 112 }));
      triggerMutation?.();
    });

    expect(
      document.querySelector('[data-combat-segment-role="attack"] path')?.getAttribute("d"),
    ).toBe("M 120 306 L 290 96");
    expect(document.querySelector('[data-combat-segment-role="attack"]')).toBe(
      segmentBeforeRerender,
    );
  });

  test("keeps observers mounted when an equivalent projected intent is recreated", () => {
    render(declaredIntent);

    render({
      ...declaredIntent,
      declaredTarget: { ...declaredIntent.declaredTarget },
      currentTarget: { ...declaredIntent.currentTarget },
    });

    expect(resizeObserverConstructions).toBe(1);
    expect(resizeObserverDisconnections).toBe(0);
  });

  test("keeps the badge inside a zero-height container during initial layout", () => {
    const board = document.querySelector<HTMLElement>(".board-mat")!;
    setRect(board, { left: 0, top: 0, width: 320, height: 0 });

    render(declaredIntent);

    expect(
      document.querySelector<HTMLElement>('[data-testid="combat-intent-attack-label"]')?.style.top,
    ).toBe("0px");
  });

  test("keeps labels clear when adjacent obstacles form one blocked region", () => {
    const board = document.querySelector<HTMLElement>(".board-mat")!;
    const firstObstacle = document.createElement("div");
    const secondObstacle = document.createElement("div");
    firstObstacle.className = "label-obstacle";
    secondObstacle.className = "label-obstacle";
    setRect(firstObstacle, { left: 300, top: 130, width: 120, height: 50 });
    setRect(secondObstacle, { left: 300, top: 190, width: 120, height: 50 });
    board.append(firstObstacle, secondObstacle);

    act(() => {
      root?.render(
        <CombatIntentOverlay intent={declaredIntent} labelAvoidSelector=".label-obstacle" />,
      );
    });

    expect(
      document.querySelector<HTMLElement>('[data-testid="combat-intent-attack-label"]')?.style.top,
    ).toBe("108px");
  });

  test("places overlapping combat labels in separate clear lanes", () => {
    const board = document.querySelector<HTMLElement>(".board-mat")!;
    setRect(board, { left: 0, top: 0, width: 600, height: 600 });
    const obstacle = document.createElement("div");
    obstacle.className = "label-obstacle";
    setRect(obstacle, { left: 200, top: 122, width: 300, height: 356 });
    board.append(obstacle);

    act(() => {
      root?.render(
        <CombatIntentOverlay
          intent={{
            ...declaredIntent,
            currentTarget: { kind: "entity", id: "blocker" },
            phase: "redirected",
            currentTargetLabel: "Attacks blocker",
          }}
          labelAvoidSelector=".label-obstacle"
        />,
      );
    });

    const attackTop = document.querySelector<HTMLElement>(
      '[data-testid="combat-intent-attack-label"]',
    )?.style.top;
    const redirectTop = document.querySelector<HTMLElement>(
      '[data-testid="combat-intent-redirect-label"]',
    )?.style.top;
    const attackLeft = Number.parseFloat(
      document.querySelector<HTMLElement>('[data-testid="combat-intent-attack-label"]')?.style
        .left ?? "NaN",
    );
    const redirectLeft = Number.parseFloat(
      document.querySelector<HTMLElement>('[data-testid="combat-intent-redirect-label"]')?.style
        .left ?? "NaN",
    );
    expect(attackTop).toBe("100px");
    expect(redirectTop).toBe("100px");
    expect(Math.abs(attackLeft - redirectLeft)).toBeGreaterThanOrEqual(120);
  });

  test("lifts compact direct-attack labels clear of the middle board divider", () => {
    const board = document.querySelector<HTMLElement>(".board-mat")!;
    setRect(board, { left: 0, top: 0, width: 390, height: 844 });
    setRect(document.querySelector<HTMLElement>('[data-sim-entity-id="attacker"]')!, {
      left: 10,
      top: 450,
      width: 60,
      height: 84,
    });
    const rival = document.createElement("div");
    rival.dataset.simPlayerId = "rival";
    setRect(rival, {
      left: 263,
      top: 176,
      width: 60,
      height: 60,
    });
    board.append(rival);

    render({
      ...declaredIntent,
      attackKind: "direct",
      declaredTarget: { kind: "player", id: "rival" },
      currentTarget: { kind: "player", id: "rival" },
      declaredTargetLabel: "Direct attack",
    });

    const top = Number.parseFloat(
      document.querySelector<HTMLElement>('[data-testid="combat-intent-attack-label"]')?.style
        .top ?? "NaN",
    );
    expect(top).toBeLessThan(240);
  });
});

function render(intent: SimulatorCombatIntent) {
  act(() => {
    root?.render(<CombatIntentOverlay intent={intent} />);
  });
}

function anchor(id: string, rect: RectInit): HTMLDivElement {
  const element = document.createElement("div");
  element.dataset.simEntityId = id;
  setRect(element, rect);
  return element;
}

interface RectInit {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}

function setRect(element: HTMLElement, rect: RectInit) {
  element.getBoundingClientRect = () =>
    ({
      ...rect,
      right: rect.left + rect.width,
      bottom: rect.top + rect.height,
      x: rect.left,
      y: rect.top,
      toJSON: () => ({}),
    }) as DOMRect;
}
