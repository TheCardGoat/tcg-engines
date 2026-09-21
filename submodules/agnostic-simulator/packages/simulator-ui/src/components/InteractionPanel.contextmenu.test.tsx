// @vitest-environment jsdom
import type { HarnessFixture, SimulatorEntity } from "@tcg/simulator-contract";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test } from "vite-plus/test";

import { CardContextMenuController } from "./CardContextMenu";
import { InteractionPanel } from "./InteractionPanel";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

const unit: SimulatorEntity = {
  id: "unit-a",
  title: "Test Unit",
  subtitle: "Unit",
  kind: "unit",
  ownerId: "player-1",
  face: "public",
  states: ["ready"],
  stats: [{ label: "Power", value: "3" }],
  traits: [],
};

const resource: SimulatorEntity = {
  id: "resource-a",
  title: "Test Resource",
  subtitle: "Resource",
  kind: "resource",
  ownerId: "player-1",
  face: "public",
  states: ["ready"],
  stats: [{ label: "GEN", value: "1" }],
  traits: [],
};

const fixture: HarnessFixture = {
  id: "context-menu-guard-fixture",
  gameSlug: "cyberpunk",
  name: "Context Menu Guard Fixture",
  summary: "Prompt chips must stay clickable while the card context controller is mounted.",
  adapterGoal: "Select prompt candidates with real clicks.",
  table: {
    status: { activeSeatId: "player-1", phase: "main", turn: 1, stateVersion: 1 },
    seats: [
      { id: "player-1", label: "Player", role: "human", perspective: "bottom", counters: [] },
    ],
    zones: [
      {
        id: "player-field",
        label: "Field",
        role: "battlefield",
        ownerId: "player-1",
        visibility: "public",
        entityIds: [unit.id, resource.id],
        hint: "Your field.",
      },
    ],
  },
  boardLayout: {
    title: "Test Table",
    summary: "Minimal layout.",
    buildingBlocks: [],
    sections: [],
  },
  entities: [unit, resource],
  interactions: [
    {
      id: "prompt-target",
      label: "Select a target",
      prompt: "Choose one target.",
      sourceEntityId: unit.id,
      input: {
        kind: "single-target",
        min: 1,
        candidateEntityIds: [unit.id],
        targetZoneIds: [],
        options: [],
      },
      movePreview: { engine: "test", command: "target", payload: "{}" },
    },
    {
      id: "prompt-payment",
      label: "Pay resources",
      prompt: "Choose resources to spend.",
      input: {
        kind: "payment",
        min: 1,
        candidateEntityIds: [resource.id],
        targetZoneIds: [],
        options: [],
      },
      movePreview: { engine: "test", command: "pay", payload: "{}" },
    },
    {
      id: "prompt-ordering",
      label: "Order targets",
      prompt: "Order the targets.",
      input: {
        kind: "ordering",
        min: 1,
        candidateEntityIds: [unit.id, resource.id],
        targetZoneIds: [],
        options: [],
      },
      movePreview: { engine: "test", command: "order", payload: "{}" },
    },
  ],
  guideSteps: [],
  agentChecks: [],
  coreComponents: [],
};

let root: Root | null = null;
let container: HTMLDivElement | null = null;

afterEach(() => {
  act(() => root?.unmount());
  document.querySelector("[data-card-context-menu]")?.remove();
  container?.remove();
  root = null;
  container = null;
});

describe("InteractionPanel inside CardContextMenuController", () => {
  test("prompt chips select with real clicks and never open the card context menu", () => {
    renderControllerWithPanel();

    for (const [testId, selector] of [
      ["target", '[data-testid="interaction-candidate:prompt-target:unit-a"]'],
      ["payment", '[data-testid="interaction-payment:prompt-payment:resource-a"]'],
      ["ordering", '[data-testid="interaction-order:prompt-ordering:unit-a"]'],
    ] as const) {
      const chip = container?.querySelector<HTMLButtonElement>(selector);
      if (!chip) throw new Error(`Missing ${testId} prompt chip.`);
      // Prompt chips must not carry the card-context marker, otherwise the
      // controller's click capture swallows their clicks.
      expect(chip.hasAttribute("data-sim-entity-id")).toBe(false);
      expect(chip.getAttribute("aria-pressed")).toBe("false");

      act(() => chip.click());

      expect(chip.getAttribute("aria-pressed")).toBe("true");
      expect(document.querySelector("[data-card-context-menu]")).toBeNull();
    }

    // Positive control: a real board card still opens the context surface, so
    // the pass above is meaningful and not a broken controller.
    const boardCard = container?.querySelector<HTMLButtonElement>(
      "[data-card-context-controller] > [data-sim-entity-id]",
    );
    if (!boardCard) throw new Error("Missing board card.");
    act(() => boardCard.click());
    expect(document.querySelector("[data-card-context-menu]")).not.toBeNull();
  });
});

function renderControllerWithPanel() {
  if (!container) {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  }
  act(() =>
    root?.render(
      <CardContextMenuController
        entities={[unit, resource]}
        actionsForEntity={(entityId) => [
          {
            id: `action:${entityId}`,
            sourceEntityId: entityId,
            label: "Inspect",
            order: 10,
            activation: "execute",
            commandRef: "inspect",
            availability: { kind: "enabled" },
          },
        ]}
        mode="quick"
        stateVersion={1}
        promptActive={false}
        onModeChange={() => undefined}
        onAction={() => undefined}
      >
        <button type="button" data-sim-entity-id={unit.id}>
          {unit.title}
        </button>
        <InteractionPanel fixture={fixture} />
      </CardContextMenuController>,
    ),
  );
}
