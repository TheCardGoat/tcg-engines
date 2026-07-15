// @vitest-environment jsdom
import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import type { SimulatorEntity, SimulatorTable } from "@tcg/simulator-contract";

import { TargetFilterModal } from "./TargetFilterModal";

const table: SimulatorTable = {
  status: {
    activeSeatId: "p1",
    phase: "Main",
    stateVersion: 1,
    turn: 1,
  },
  seats: [{ id: "p1", label: "Player", role: "human", perspective: "bottom", counters: [] }],
  zones: [
    {
      id: "p-trash",
      label: "Trash",
      role: "discard",
      ownerId: "p1",
      visibility: "public",
      entityIds: ["gear-card"],
      count: 1,
      hint: "Player trash",
    },
    {
      id: "p-hand",
      label: "Hand",
      role: "hand",
      ownerId: "p1",
      visibility: "private",
      entityIds: ["hand-card"],
      count: 1,
      hint: "Player hand",
    },
  ],
};

const entities: SimulatorEntity[] = [
  {
    id: "gear-card",
    title: "Mandibular Upgrade",
    subtitle: "Gear",
    kind: "card",
    ownerId: "p1",
    face: "public",
    states: [],
    stats: [],
    traits: ["Cyberware"],
    dataAttributes: { zoneId: "p-trash" },
  },
  {
    id: "hand-card",
    title: "Ruthless Lowlife",
    subtitle: "Unit",
    kind: "card",
    ownerId: "p1",
    face: "public",
    states: [],
    stats: [],
    traits: [],
    dataAttributes: { zoneId: "p-hand" },
  },
];

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

function renderModal(element: ReactNode): HTMLDivElement {
  activeContainer = document.createElement("div");
  document.body.append(activeContainer);
  activeRoot = createRoot(activeContainer);
  act(() => activeRoot?.render(element));
  return activeContainer;
}

describe("TargetFilterModal", () => {
  test("renders only entities matched by the target filter", () => {
    const container = renderModal(
      <TargetFilterModal
        opened
        title="Your Trash"
        filter={{ kind: "entity", entityKind: "card", ownerId: "p1", zoneId: "p-trash" }}
        table={table}
        entities={entities}
        onClose={() => undefined}
      />,
    );

    expect(container.querySelector('[data-testid="target-filter-modal"]')).toBeNull();
    expect(document.body.querySelector('[data-testid="target-filter-modal"]')).toBeTruthy();
    expect(document.body.textContent).toContain("Mandibular Upgrade");
    expect(document.body.textContent).not.toContain("Ruthless Lowlife");
    expect(
      document.body.querySelector('[data-testid="target-filter-modal-count"]')?.textContent,
    ).toBe("1 card");
  });

  test("renders an empty state when no entities match", () => {
    renderModal(
      <TargetFilterModal
        opened
        title="Rival Trash"
        filter={{ kind: "entity", entityKind: "card", ownerId: "p1", zoneId: "missing-zone" }}
        table={table}
        entities={entities}
        onClose={() => undefined}
        emptyLabel="Trash is empty"
      />,
    );

    expect(document.body.textContent).toContain("Trash is empty");
    expect(
      document.body.querySelector('[data-testid="target-filter-modal-count"]')?.textContent,
    ).toBe("0 cards");
  });

  test("closes through the close control", () => {
    const onClose = vi.fn();
    renderModal(
      <TargetFilterModal
        opened
        title="Your Trash"
        filter={{ kind: "entity", entityKind: "card", ownerId: "p1", zoneId: "p-trash" }}
        table={table}
        entities={entities}
        onClose={onClose}
      />,
    );

    const close = document.body.querySelector<HTMLButtonElement>(
      '[data-testid="target-filter-modal-close"]',
    );
    expect(close).toBeTruthy();
    act(() => close?.click());

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
