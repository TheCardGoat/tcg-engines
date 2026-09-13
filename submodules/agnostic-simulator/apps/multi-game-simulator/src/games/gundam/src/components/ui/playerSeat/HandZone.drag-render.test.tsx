// @vitest-environment jsdom
import { act, cleanup, render } from "@testing-library/react";
import type { HTMLAttributes, ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";

import type { GameCardData } from "../types.ts";

const dragStore = vi.hoisted(() => {
  let version = 0;
  const listeners = new Set<() => void>();
  return {
    getSnapshot: () => version,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    move: () => {
      version += 1;
      for (const listener of listeners) listener();
    },
    reset: () => {
      version = 0;
      listeners.clear();
    },
  };
});

const renderCounts = vi.hoisted(() => ({
  card: 0,
  slot: 0,
  draggable: 0,
}));

vi.mock("@dnd-kit/core", async () => {
  const { useSyncExternalStore } = await import("react");
  return {
    useDraggable: () => {
      const version = useSyncExternalStore(
        dragStore.subscribe,
        dragStore.getSnapshot,
        dragStore.getSnapshot,
      );
      renderCounts.draggable += 1;
      return {
        attributes: { "aria-describedby": "drag-instructions" },
        listeners: { onPointerDown: () => undefined, onKeyDown: () => undefined },
        setNodeRef: () => undefined,
        isDragging: version > 0,
        transform: { x: version, y: version },
      };
    },
  };
});

vi.mock("@tcg/simulator-ui", () => ({
  AnimatedEntityCollection: ({ children }: { readonly children: ReactNode }) => children,
  AnimatedEntitySlot: ({
    children,
    className,
    style,
  }: {
    readonly children: ReactNode;
    readonly className?: string;
    readonly style?: HTMLAttributes<HTMLDivElement>["style"];
  }) => {
    renderCounts.slot += 1;
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  },
  PointerDragDropSurface: ({ children }: { readonly children: ReactNode }) => children,
}));

vi.mock("../GameCard.tsx", () => ({
  GameCard: ({ name }: Pick<GameCardData, "name">) => {
    renderCounts.card += 1;
    return <div>{name}</div>;
  },
  GameCardVisual: ({ name }: Pick<GameCardData, "name">) => <div>{name}</div>,
}));

vi.mock("../../../animation/gundamAnimationVisual.tsx", () => ({
  gundamAnimationEntityForCard: (card: GameCardData) => ({
    id: card.id ?? card.name,
    title: card.name,
    kind: "card",
    ownerId: "viewer",
    face: card.faceDown ? "hidden" : "public",
    states: [],
    stats: [],
    traits: [],
    dataAttributes: {},
  }),
}));

import { HandZone } from "./HandZone.tsx";

const cards: readonly GameCardData[] = [
  { id: "gm", name: "GM", cardType: "unit", cost: 1 },
  { id: "guncannon", name: "Guncannon", cardType: "unit", cost: 2 },
];

beforeEach(() => {
  dragStore.reset();
  renderCounts.card = 0;
  renderCounts.slot = 0;
  renderCounts.draggable = 0;
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: () => ({
      matches: false,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    }),
  });
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

afterEach(cleanup);

describe("HandZone pointer render isolation", () => {
  it("keeps animation slots and card visuals stable across drag transform updates", () => {
    const view = render(
      <HandZone hand={cards} isOpponent={false} canPlay={() => true} zoneId="hand:viewer" />,
    );
    const initial = { ...renderCounts };
    expect(initial.card).toBe(2);
    expect(initial.slot).toBe(2);

    for (let index = 0; index < 20; index += 1) {
      act(() => dragStore.move());
    }

    expect(renderCounts.draggable).toBeGreaterThan(initial.draggable);
    expect(renderCounts.card).toBe(initial.card);
    expect(renderCounts.slot).toBe(initial.slot);

    view.rerender(
      <HandZone
        hand={[{ ...cards[0]!, damage: 1 }, cards[1]!]}
        isOpponent={false}
        canPlay={() => true}
        zoneId="hand:viewer"
      />,
    );

    expect(renderCounts.card).toBeGreaterThan(initial.card);
    expect(renderCounts.slot).toBeGreaterThan(initial.slot);
  });
});
