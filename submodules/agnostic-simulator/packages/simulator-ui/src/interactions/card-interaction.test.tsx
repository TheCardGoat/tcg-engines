// @vitest-environment jsdom
import type { SimulatorEntity } from "@tcg/simulator-contract";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

import {
  actionsForCard,
  resolveCardInteractionState,
  useCardInteractionController,
  type CardInteractionAction,
} from "./card-interaction";
import { CardActionPicker } from "../components/CardActionPicker";

const card: SimulatorEntity = {
  id: "card-1",
  title: "Test Card",
  subtitle: "Card",
  kind: "card",
  ownerId: "player-1",
  face: "public",
  states: [],
  stats: [],
  traits: [],
};

const actions: readonly CardInteractionAction[] = [
  { id: "play", sourceEntityIds: [card.id], label: "Play" },
  { id: "pitch", sourceEntityIds: [card.id], label: "Pitch" },
  { id: "disabled", sourceEntityIds: [card.id], label: "Disabled", disabledReason: "No priority" },
];

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root | null = null;
let container: HTMLDivElement | null = null;

afterEach(() => {
  if (root) act(() => root?.unmount());
  container?.remove();
  root = null;
  container = null;
});

function mount(node: React.ReactNode) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() => root?.render(node));
}

describe("card interaction presentation", () => {
  test("filters disabled actions and resolves the documented visual precedence", () => {
    expect(actionsForCard(actions, card.id).map((action) => action.id)).toEqual(["play", "pitch"]);
    expect(
      resolveCardInteractionState({
        entityId: card.id,
        actions,
        selectedEntityId: card.id,
        targetableEntityIds: new Set([card.id]),
      }),
    ).toEqual({ kind: "selected", actionCount: 2 });
    expect(
      resolveCardInteractionState({
        entityId: card.id,
        actions: [],
        targetableEntityIds: new Set([card.id]),
      }),
    ).toEqual({ kind: "targetable" });
  });
});

describe("useCardInteractionController", () => {
  test("inspects idle cards, selects multiple actions, and dispatches a chosen action", () => {
    const onExecute = vi.fn();
    const onInspect = vi.fn();
    function Harness({ availableActions }: { availableActions: readonly CardInteractionAction[] }) {
      const controller = useCardInteractionController({
        actions: availableActions,
        onExecute,
        onInspect,
      });
      return (
        <>
          <button type="button" onClick={() => controller.activate(card)}>
            Activate
          </button>
          <button type="button" onClick={() => controller.executeAction("pitch")}>
            Pitch
          </button>
          <output data-testid="state">{controller.stateFor(card).kind}</output>
          <output data-testid="picker">
            {controller.actionPicker?.actions.map((action) => action.id).join(",") ?? "none"}
          </output>
        </>
      );
    }

    mount(<Harness availableActions={[]} />);
    const button = (label: string) =>
      [...container!.querySelectorAll("button")].find(
        (candidate) => candidate.textContent === label,
      )!;
    act(() => button("Activate").click());
    expect(onInspect).toHaveBeenCalledWith(card);

    act(() => root?.render(<Harness availableActions={actions} />));
    act(() => button("Activate").click());
    expect(container!.querySelector('[data-testid="state"]')?.textContent).toBe("selected");
    expect(container!.querySelector('[data-testid="picker"]')?.textContent).toBe("play,pitch");

    act(() => button("Pitch").click());
    expect(onExecute).toHaveBeenCalledWith("pitch");
    expect(container!.querySelector('[data-testid="state"]')?.textContent).toBe("actionable");
  });

  test("can dispatch one unambiguous action immediately and gives targets precedence on click", () => {
    const onExecute = vi.fn();
    const onTarget = vi.fn();
    function Harness({ targetable }: { targetable: boolean }) {
      const controller = useCardInteractionController({
        actions: actions.slice(0, 1),
        autoExecuteSingle: true,
        targetableEntityIds: targetable ? new Set([card.id]) : undefined,
        onExecute,
        onInspect: vi.fn(),
        onTarget,
      });
      return (
        <button type="button" onClick={() => controller.activate(card)}>
          Activate
        </button>
      );
    }

    mount(<Harness targetable={false} />);
    act(() => container!.querySelector("button")!.click());
    expect(onExecute).toHaveBeenCalledWith("play");

    act(() => root?.render(<Harness targetable />));
    act(() => container!.querySelector("button")!.click());
    expect(onTarget).toHaveBeenCalledWith(card);
    expect(onExecute).toHaveBeenCalledTimes(1);
  });
});

describe("CardActionPicker", () => {
  test("focuses its first action and supports keyboard choice and dismissal", () => {
    const onChoose = vi.fn();
    const onClose = vi.fn();
    mount(
      <CardActionPicker
        model={{ entity: card, actions: actions.slice(0, 2) }}
        onChoose={onChoose}
        onClose={onClose}
      />,
    );
    const dialog = container!.querySelector<HTMLElement>('[role="dialog"]')!;
    const first = dialog.querySelectorAll<HTMLButtonElement>("button")[1]!;
    expect(document.activeElement?.textContent).toBe("Play");
    act(() => first.click());
    expect(onChoose).toHaveBeenCalledWith("play");
    void act(() =>
      dialog.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })),
    );
    expect(onClose).toHaveBeenCalledOnce();
  });
});
