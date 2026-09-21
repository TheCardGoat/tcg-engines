// @vitest-environment jsdom
import { act, cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import type { GameCardData } from "../types.ts";

interface CapturedSurfaceProps {
  readonly children: ReactNode;
  readonly renderOverlay: (source: GundamDragSource) => ReactNode;
  readonly onDragStart?: (source: GundamDragSource | null) => void;
  readonly onDragCancel?: () => void;
  readonly onDragEnd?: (
    source: GundamDragSource | null,
    overId: string | null,
  ) => { readonly kind: "accepted" | "rejected" };
}

const dragHarness = vi.hoisted(() => ({
  surfaceProps: null as CapturedSurfaceProps | null,
}));

vi.mock("@tcg/simulator-ui", () => ({
  PointerDragDropSurface: (props: CapturedSurfaceProps) => {
    dragHarness.surfaceProps = props;
    return props.children;
  },
}));

vi.mock("../GameCard.tsx", () => ({
  GameCardVisual: ({ id, name }: Pick<GameCardData, "id" | "name">) => (
    <div data-testid="passive-drag-overlay" data-card-id={id}>
      {name}
    </div>
  ),
}));

import {
  GundamDragDropProvider,
  encodeGundamBattleAreaTarget,
  type GundamDragSource,
  useGundamDragCommands,
  useGundamDragState,
} from "./gundam-drag-drop-context.tsx";

const handSource: GundamDragSource = {
  type: "hand-card",
  cardId: "card-1",
  card: { name: "GM", cardType: "unit", cost: 1 },
};

afterEach(() => {
  cleanup();
  dragHarness.surfaceProps = null;
});

describe("GundamDragDropProvider render isolation", () => {
  it("updates drag-state consumers without rerendering command or passive consumers", () => {
    const renders = { state: 0, commands: 0, passive: 0 };

    function StateProbe() {
      renders.state += 1;
      const activeSource = useGundamDragState();
      return <span>{activeSource?.cardId ?? "idle"}</span>;
    }

    function CommandsProbe() {
      renders.commands += 1;
      useGundamDragCommands();
      return null;
    }

    function PassiveProbe() {
      renders.passive += 1;
      return null;
    }

    render(
      <GundamDragDropProvider>
        <StateProbe />
        <CommandsProbe />
        <PassiveProbe />
      </GundamDragDropProvider>,
    );
    expect(renders).toEqual({ state: 1, commands: 1, passive: 1 });

    act(() => dragHarness.surfaceProps?.onDragStart?.(handSource));
    expect(screen.getByText("card-1")).not.toBeNull();
    expect(renders).toEqual({ state: 2, commands: 1, passive: 1 });

    act(() => dragHarness.surfaceProps?.onDragCancel?.());
    expect(screen.getByText("idle")).not.toBeNull();
    expect(renders).toEqual({ state: 3, commands: 1, passive: 1 });
  });

  it("uses identity-safe cleanup and dispatches through the latest registered handler", () => {
    let commands!: ReturnType<typeof useGundamDragCommands>;
    const firstHandler = vi.fn();
    const latestHandler = vi.fn();

    function CommandsProbe() {
      commands = useGundamDragCommands();
      return null;
    }

    render(
      <GundamDragDropProvider>
        <CommandsProbe />
      </GundamDragDropProvider>,
    );

    const cleanupFirst = commands.registerCardDropHandler(firstHandler);
    const cleanupLatest = commands.registerCardDropHandler(latestHandler);
    cleanupFirst();

    const target = encodeGundamBattleAreaTarget({
      type: "battle-area",
      playerId: "viewer",
    });
    let accepted = false;
    act(() => {
      accepted = dragHarness.surfaceProps?.onDragEnd?.(handSource, target).kind === "accepted";
    });

    expect(accepted).toBe(true);
    expect(firstHandler).not.toHaveBeenCalled();
    expect(latestHandler).toHaveBeenCalledWith("card-1");

    cleanupLatest();
    act(() => {
      accepted = dragHarness.surfaceProps?.onDragEnd?.(handSource, target).kind === "accepted";
    });
    expect(accepted).toBe(false);
    expect(latestHandler).toHaveBeenCalledTimes(1);
  });

  it("renders the overlay through the passive card visual", () => {
    render(
      <GundamDragDropProvider>
        <div>Board</div>
      </GundamDragDropProvider>,
    );

    render(<>{dragHarness.surfaceProps?.renderOverlay(handSource)}</>);

    expect(screen.getByTestId("passive-drag-overlay").dataset.cardId).toBe("card-1");
    expect(screen.getByTestId("passive-drag-overlay").textContent).toBe("GM");
  });
});
