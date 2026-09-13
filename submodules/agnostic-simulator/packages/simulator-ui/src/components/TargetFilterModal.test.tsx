// @vitest-environment jsdom
import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import type { SimulatorEntity, SimulatorTable } from "@tcg/simulator-contract";

import { createSimulatorAnimationScope, DefaultSimulatorEntityVisual } from "../animation";
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
const TestAnimation = createSimulatorAnimationScope<{
  entities: readonly SimulatorEntity[];
  table: SimulatorTable;
}>();

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
  act(() =>
    activeRoot?.render(
      <TestAnimation.Root
        sessionKey="target-filter-modal"
        initialState={{ entities, table }}
        initialVersion={1}
        projection={{
          getEntity: (state, entityId) =>
            state.entities.find((entity) => entity.id === entityId) ?? null,
          getZone: (state, ref) => state.table.zones.find((zone) => zone.id === ref.id) ?? null,
        }}
        entityRenderer={DefaultSimulatorEntityVisual}
        viewerSeatId="p1"
        animationSpeed="off"
      >
        {element}
      </TestAnimation.Root>,
    ),
  );
  return activeContainer;
}

describe("TargetFilterModal", () => {
  test("surfaces inspect-mode card actions without replacing external preview behavior", () => {
    const onInspect = vi.fn();
    const onSelect = vi.fn();
    renderModal(
      <TargetFilterModal
        opened
        title="Your Banished"
        description="1 card is available now. Choose a highlighted card to act."
        filter={{ kind: "entity", entityKind: "card", ownerId: "p1", zoneId: "p-trash" }}
        table={table}
        entities={entities}
        interactionStateFor={(entity) =>
          entity.id === "gear-card" ? { kind: "actionable", actionCount: 1 } : { kind: "idle" }
        }
        onSelect={onSelect}
        cardInspection={{ kind: "external", onInspect }}
        onClose={() => undefined}
      />,
    );

    const card = document.body.querySelector<HTMLElement>('[data-card-id="gear-card"]');
    expect(card?.querySelector('[data-card-interaction="actionable"]')).toBeTruthy();
    expect(document.body.textContent).toContain("1 card is available now");

    const cardButton = card?.querySelector("button");
    void act(() => cardButton?.dispatchEvent(new MouseEvent("click", { bubbles: true })));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "gear-card" }));
    expect(onInspect).not.toHaveBeenCalled();
  });

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

  test("contains focus, makes the background inert, and restores the invoking control", () => {
    const invoker = document.createElement("button");
    invoker.textContent = "Open choices";
    document.body.append(invoker);
    invoker.focus();

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

    const dialog = document.body.querySelector<HTMLElement>('[role="dialog"]');
    expect(document.activeElement).toBe(dialog);
    expect(container.inert).toBe(true);
    expect(container.getAttribute("aria-hidden")).toBe("true");

    act(() => {
      dialog?.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));
    });
    expect(document.activeElement?.getAttribute("data-testid")).toBe("target-filter-modal-close");

    act(() => activeRoot?.unmount());
    activeRoot = null;
    expect(document.activeElement).toBe(invoker);
    expect(container.inert).not.toBe(true);
    expect(container.hasAttribute("aria-hidden")).toBe(false);
    invoker.remove();
  });

  test("keeps passive inspection nonmodal and delegates card preview", () => {
    const onInspect = vi.fn();
    const onPreviewEnd = vi.fn();
    const container = renderModal(
      <TargetFilterModal
        opened
        presentation="nonmodal"
        title="Your Trash"
        filter={{ kind: "entity", entityKind: "card", ownerId: "p1", zoneId: "p-trash" }}
        table={table}
        entities={entities}
        cardInspection={{ kind: "external", onInspect, onPreviewEnd }}
        onClose={() => undefined}
      />,
    );

    const dialog = document.body.querySelector<HTMLElement>('[role="dialog"]');
    expect(dialog?.getAttribute("aria-modal")).toBeNull();
    expect(container.inert).not.toBe(true);
    expect(container.hasAttribute("aria-hidden")).toBe(false);
    expect(
      document.body
        .querySelector('[data-testid="target-filter-modal-backdrop"]')
        ?.getAttribute("data-presentation"),
    ).toBe("nonmodal");

    const card = document.body.querySelector<HTMLElement>('[data-card-id="gear-card"]');
    void act(() => card?.dispatchEvent(new MouseEvent("mouseover", { bubbles: true })));
    expect(onInspect).toHaveBeenCalledWith(entities[0]);
    void act(() => card?.dispatchEvent(new MouseEvent("mouseout", { bubbles: true })));
    expect(onPreviewEnd).toHaveBeenCalledTimes(1);
    act(() => card?.querySelector<HTMLButtonElement>("button")?.click());
    expect(onInspect).toHaveBeenCalledTimes(2);
    expect(document.body.querySelector('[data-testid="card-inspector-popover"]')).toBeNull();
  });

  test("groups inspectable copies in the header while keeping unkeyed cards separate", () => {
    const groupedEntities: SimulatorEntity[] = [
      {
        ...entities[0]!,
        id: "copy-1",
        dataAttributes: { zoneId: "p-trash", "data-group-key": "same" },
      },
      {
        ...entities[0]!,
        id: "copy-2",
        dataAttributes: { zoneId: "p-trash", "data-group-key": "same" },
      },
      {
        ...entities[0]!,
        id: "face-down-1",
        title: "Hidden card",
        face: "hidden",
        dataAttributes: { zoneId: "p-trash" },
      },
      {
        ...entities[0]!,
        id: "face-down-2",
        title: "Hidden card",
        face: "hidden",
        dataAttributes: { zoneId: "p-trash" },
      },
    ];
    const groupedTable: SimulatorTable = {
      ...table,
      zones: table.zones.map((zone) =>
        zone.id === "p-trash"
          ? {
              ...zone,
              entityIds: groupedEntities.map((entity) => entity.id),
              count: groupedEntities.length,
            }
          : zone,
      ),
    };

    renderModal(
      <TargetFilterModal
        opened
        presentation="nonmodal"
        title="Your Trash"
        filter={{
          kind: "entity",
          entityKind: "card",
          ownerId: "p1",
          zoneId: "p-trash",
          includeHidden: true,
        }}
        table={groupedTable}
        entities={groupedEntities}
        duplicateFilter={{
          label: "Group same cards",
          keyFor: (entity) => {
            const key = entity.dataAttributes?.["data-group-key"];
            return typeof key === "string" ? key : undefined;
          },
        }}
        onClose={() => undefined}
      />,
    );

    const toggle = document.body.querySelector<HTMLInputElement>(
      '[data-testid="target-filter-hide-duplicates"]',
    );
    expect(toggle?.closest("header")).toBeTruthy();
    expect(toggle?.closest("label")?.textContent).toContain("Group same cards");
    expect(toggle?.closest("label")?.textContent).toContain("1 grouped");
    expect(document.body.querySelectorAll(".card-grid-copy-count")).toHaveLength(1);
    expect(document.body.querySelector(".card-grid-copy-count")?.textContent).toBe("2 copies");
    expect(
      document.body
        .querySelector('[role="listitem"][data-card-id="copy-1"]')
        ?.getAttribute("aria-label"),
    ).toBe(`${entities[0]!.title}, 2 copies`);
    expect(document.body.querySelectorAll('[role="list"] > [role="listitem"]')).toHaveLength(3);
    expect(
      document.body.querySelector('[data-testid="target-filter-modal-count"]')?.textContent,
    ).toBe("4 cards");

    act(() => toggle?.click());
    expect(toggle?.checked).toBe(false);
    expect(document.body.querySelector(".card-grid-copy-count")).toBeNull();
    expect(document.body.querySelectorAll('[role="list"] > [role="listitem"]')).toHaveLength(4);
  });

  test("opens a readable inspection popover when a listed card is clicked", () => {
    renderModal(
      <TargetFilterModal
        opened
        title="Your Trash"
        filter={{ kind: "entity", entityKind: "card", ownerId: "p1", zoneId: "p-trash" }}
        table={table}
        entities={entities}
        onClose={() => undefined}
      />,
    );

    const card = document.body.querySelector<HTMLElement>(
      '[data-card-id="gear-card"] .card-inspector-reference',
    );
    expect(card).toBeTruthy();
    act(() => card?.click());

    expect(
      document.body.querySelector('[data-testid="card-inspector-popover"]')?.textContent,
    ).toContain("Mandibular Upgrade");
  });

  test("supports controlled selection, confirmation, choosing none, and minimization", () => {
    const onSelect = vi.fn();
    const onConfirm = vi.fn();
    const onChooseNone = vi.fn();
    const onMinimize = vi.fn();
    renderModal(
      <TargetFilterModal
        opened
        mode="select"
        title="Choose a card"
        description="Choose a card to put into your hand."
        filter={{ kind: "entity", entityKind: "card", ownerId: "p1", zoneId: "p-trash" }}
        table={table}
        entities={entities}
        selectedIds={["gear-card"]}
        max={1}
        onSelect={onSelect}
        confirmation={{ canConfirm: true, onConfirm }}
        onChooseNone={onChooseNone}
        onMinimize={onMinimize}
      />,
    );

    expect(
      document.body.querySelector('[data-testid="target-filter-modal-count"]')?.textContent,
    ).toBe("1/1 selected");
    const card = document.body.querySelector<HTMLButtonElement>(
      '[data-card-id="gear-card"] button',
    );
    expect(card?.getAttribute("aria-pressed")).toBe("true");
    act(() => card?.click());
    expect(onSelect).toHaveBeenCalledWith(entities[0]);

    const buttons = [...document.body.querySelectorAll<HTMLButtonElement>("button")];
    act(() => buttons.find((button) => button.textContent === "Choose none")?.click());
    act(() => buttons.find((button) => button.textContent === "Confirm choice")?.click());
    act(() =>
      document.body
        .querySelector<HTMLButtonElement>('[aria-label="Minimize Choose a card"]')
        ?.click(),
    );

    expect(onChooseNone).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onMinimize).toHaveBeenCalledTimes(1);
    expect(document.body.querySelector('[data-testid="card-inspector-popover"]')).toBeNull();
  });

  test("changes grid columns and previews a selectable card beside the grid", () => {
    const previewEntities = [
      { ...entities[0]!, imageUrl: "/cards/mandibular-upgrade.webp" },
      entities[1]!,
      ...["gear-card-2", "gear-card-3", "gear-card-4"].map((id) => ({
        ...entities[0]!,
        id,
      })),
    ];
    const previewTable: SimulatorTable = {
      ...table,
      zones: table.zones.map((zone) =>
        zone.id === "p-trash"
          ? { ...zone, entityIds: previewEntities.map((entity) => entity.id), count: 5 }
          : zone,
      ),
    };
    renderModal(
      <TargetFilterModal
        opened
        mode="select"
        title="Choose a card"
        filter={{ kind: "entity", entityKind: "card", ownerId: "p1", zoneId: "p-trash" }}
        table={previewTable}
        entities={previewEntities}
        selectedIds={[]}
        max={1}
        onSelect={() => undefined}
        onMinimize={() => undefined}
        renderPreview={(entity) => (
          <div data-testid="native-card-preview">Native preview for {entity.title}</div>
        )}
      />,
    );

    const grid = document.body.querySelector<HTMLElement>('[role="list"]');
    expect(grid?.style.gridTemplateColumns).toContain("repeat(4,");
    expect(grid?.className).toContain("overflow-visible");
    expect(document.body.querySelector(".target-filter-modal-grid")?.className).toContain(
      "overflow-y-auto",
    );
    expect(document.body.querySelector(".target-filter-modal-grid")?.className).toContain(
      "overflow-x-hidden",
    );

    const threeColumns = document.body.querySelector<HTMLButtonElement>(
      'button[aria-label="3 cards per row"]',
    );
    act(() => threeColumns?.click());
    expect(grid?.style.gridTemplateColumns).toContain("repeat(3,");
    expect(threeColumns?.getAttribute("aria-pressed")).toBe("true");

    expect(grid?.textContent).toContain("Mandibular Upgrade");
    expect(
      document.body.querySelector('[data-testid="target-filter-modal-preview"]')?.textContent,
    ).toContain("Mandibular Upgrade");

    const card = document.body.querySelector<HTMLElement>('[data-card-id="gear-card"]');
    void act(() => card?.dispatchEvent(new MouseEvent("mouseover", { bubbles: true })));

    const preview = document.body.querySelector('[data-testid="target-filter-modal-preview"]');
    expect(preview?.textContent).toContain("Mandibular Upgrade");
    expect(preview?.querySelector('[data-testid="native-card-preview"]')).toBeTruthy();
    expect(preview?.closest(".target-filter-modal-content")).toBeTruthy();
    expect(document.body.querySelector('[data-testid="card-inspector-popover"]')).toBeNull();
  });

  test("hides fungible deck copies by default and lets the player show every copy", () => {
    const deckEntities: SimulatorEntity[] = [
      ...["copy-1", "copy-2", "copy-3"].map((id) => ({
        ...entities[0]!,
        id,
        dataAttributes: { zoneId: "p-deck", canonicalId: "same-card" },
      })),
      {
        ...entities[1]!,
        id: "different-card",
        dataAttributes: { zoneId: "p-deck", canonicalId: "different-card" },
      },
    ];
    const deckTable: SimulatorTable = {
      ...table,
      zones: [
        ...table.zones,
        {
          id: "p-deck",
          label: "Deck",
          role: "deck",
          ownerId: "p1",
          visibility: "owner",
          entityIds: deckEntities.map((entity) => entity.id),
          count: deckEntities.length,
          hint: "deck-search",
        },
      ],
    };

    renderModal(
      <TargetFilterModal
        opened
        mode="select"
        title="Search your deck"
        filter={{ kind: "entity", entityKind: "card", ownerId: "p1", zoneId: "p-deck" }}
        table={deckTable}
        entities={deckEntities}
        duplicateFilter={{
          keyFor: (entity) => {
            const key = entity.dataAttributes?.["canonicalId"];
            return typeof key === "string" ? key : undefined;
          },
        }}
        selectedIds={["copy-2"]}
        max={1}
        onSelect={() => undefined}
        onMinimize={() => undefined}
      />,
    );

    const toggle = document.body.querySelector<HTMLInputElement>(
      '[data-testid="target-filter-hide-duplicates"]',
    );
    expect(toggle?.checked).toBe(true);
    expect(toggle?.closest("label")?.textContent).toContain("Hide duplicates");
    expect(toggle?.closest("label")?.textContent).toContain("2 grouped");
    expect(document.body.textContent).not.toContain("Point to or focus a card to preview");
    expect(document.body.querySelectorAll('[role="list"] > [role="listitem"]')).toHaveLength(2);
    expect(document.body.querySelector('[data-card-id="copy-2"]')).toBeTruthy();
    expect(document.body.querySelector('[data-card-id="copy-1"]')).toBeNull();

    act(() => toggle?.click());
    expect(toggle?.checked).toBe(false);
    expect(toggle?.closest("label")?.textContent).toContain("2 duplicates");
    expect(document.body.querySelectorAll('[role="list"] > [role="listitem"]')).toHaveLength(4);
  });

  test("omits confirmation for an immediate single selection", () => {
    renderModal(
      <TargetFilterModal
        opened
        mode="select"
        title="Choose a card"
        filter={{ kind: "entity", entityKind: "card", ownerId: "p1", zoneId: "p-trash" }}
        table={table}
        entities={entities}
        selectedIds={[]}
        max={1}
        onSelect={() => undefined}
        onMinimize={() => undefined}
      />,
    );

    expect(
      [...document.body.querySelectorAll("button")].some(
        (button) => button.textContent === "Confirm choice",
      ),
    ).toBe(false);
  });
});
