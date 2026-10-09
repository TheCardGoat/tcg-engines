// @vitest-environment jsdom
import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import {
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
  type DropAnimation,
} from "@dnd-kit/core";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

interface CapturedDndContextProps {
  readonly id: string;
  readonly children: ReactNode;
  readonly sensors: readonly { sensor: unknown; options?: unknown }[];
  readonly onDragMove: (event: DragMoveEvent) => void;
  readonly onDragStart: (event: DragStartEvent) => void;
  readonly onDragCancel: () => void;
  readonly onDragEnd: (event: DragEndEvent) => void;
}

const dndHarness = vi.hoisted(() => ({
  contextProps: null as CapturedDndContextProps | null,
  dropAnimation: null as DropAnimation | null,
}));

vi.mock("@dnd-kit/core", () => ({
  DndContext: (props: CapturedDndContextProps) => {
    dndHarness.contextProps = props;
    return props.children;
  },
  DragOverlay: ({
    children,
    dropAnimation,
  }: {
    readonly children: ReactNode;
    readonly dropAnimation: DropAnimation | null;
  }) => {
    dndHarness.dropAnimation = dropAnimation;
    return children;
  },
  KeyboardSensor: function KeyboardSensor() {},
  MouseSensor: function MouseSensor() {},
  PointerSensor: function PointerSensor() {},
  TouchSensor: function TouchSensor() {},
  defaultDropAnimationSideEffects: () => () => undefined,
  useDndMonitor: () => undefined,
  useDndContext: () => ({ activeNodeRect: { left: 20, top: 30, width: 60, height: 84 } }),
  useSensor: (sensor: unknown, options?: unknown) => ({ sensor, options }),
  useSensors: (...sensors: unknown[]) => sensors,
}));

import { createDragMotion } from "./drag-motion";
import { PointerDragDropSurface, type DropDisposition } from "./PointerDragDropSurface";

let activeRoot: Root | null = null;
let activeContainer: HTMLDivElement | null = null;

afterEach(() => {
  if (activeRoot) {
    act(() => activeRoot?.unmount());
  }
  activeContainer?.remove();
  activeRoot = null;
  activeContainer = null;
  dndHarness.contextProps = null;
  dndHarness.dropAnimation = null;
});

describe("PointerDragDropSurface", () => {
  test("external presentation measures its source after activation and draws no overlay", () => {
    const motion = createDragMotion<string>();
    const overlay = vi.fn(() => <span>Duplicate</span>);
    activeContainer = document.createElement("div");
    document.body.append(activeContainer);
    activeRoot = createRoot(activeContainer);
    act(() =>
      activeRoot?.render(
        <PointerDragDropSurface
          id="external"
          motion={motion}
          presentation="external"
          decodeSource={(id) => id}
          renderOverlay={overlay}
          onDragEnd={() => ({ kind: "accepted" })}
        >
          Board
        </PointerDragDropSurface>,
      ),
    );
    const start: DragStartEvent = {
      active: {
        id: "card",
        data: { current: {} },
        rect: { current: { initial: null, translated: null } },
      },
      activatorEvent: new Event("pointerdown"),
    };
    act(() => dndHarness.contextProps?.onDragStart(start));
    expect(motion.getSnapshot()).toMatchObject({
      source: "card",
      rect: { left: 20, top: 30, width: 60, height: 84 },
    });
    const move: DragMoveEvent = {
      ...start,
      delta: { x: 90, y: -30 },
      over: null,
      collisions: null,
    };
    act(() => dndHarness.contextProps?.onDragMove(move));
    expect(motion.getSnapshot()?.offset).toEqual(move.delta);
    act(() => dndHarness.contextProps?.onDragEnd(move));
    expect(motion.getSnapshot()?.phase).toBe("pending");
    expect(overlay).not.toHaveBeenCalled();
    expect(activeContainer.textContent).toBe("Board");
    motion.finish();
  });

  test("keeps source decoding generic while owning the drag lifecycle and overlay", () => {
    const onDragStart = vi.fn();
    const onDragCancel = vi.fn();
    const onDragEnd = vi.fn((): DropDisposition => ({ kind: "rejected" }));
    activeContainer = document.createElement("div");
    document.body.append(activeContainer);
    activeRoot = createRoot(activeContainer);

    act(() =>
      activeRoot?.render(
        <PointerDragDropSurface
          id="test-board-dnd"
          decodeSource={(id) => (id.startsWith("source:") ? { id: id.slice(7) } : null)}
          renderOverlay={(source) => <span>Dragging {source.id}</span>}
          onDragStart={onDragStart}
          onDragCancel={onDragCancel}
          onDragEnd={onDragEnd}
        >
          <div>Board</div>
        </PointerDragDropSurface>,
      ),
    );

    expect(dndHarness.contextProps?.id).toBe("test-board-dnd");
    expect(dndHarness.contextProps?.sensors).toHaveLength(3);
    expect(dndHarness.contextProps?.sensors[0]?.options).toEqual({
      activationConstraint: { distance: 4 },
    });
    expect(activeContainer.textContent).toBe("Board");

    const startEvent = {
      active: { id: "source:alpha" },
    } as unknown as DragStartEvent;
    act(() => dndHarness.contextProps?.onDragStart(startEvent));

    expect(activeContainer.textContent).toContain("Dragging alpha");
    expect(onDragStart).toHaveBeenCalledWith({ id: "alpha" }, startEvent);

    const endEvent = {
      active: { id: "source:alpha" },
      over: { id: "target:field" },
    } as unknown as DragEndEvent;
    act(() => dndHarness.contextProps?.onDragEnd(endEvent));

    expect(activeContainer.textContent).toBe("Board");
    expect(onDragEnd).toHaveBeenCalledWith({ id: "alpha" }, "target:field", endEvent);

    act(() => dndHarness.contextProps?.onDragCancel());
    expect(onDragCancel).toHaveBeenCalledOnce();
  });

  test("ends an accepted overlay at its release transform instead of snapping it back", () => {
    const onDragEnd = vi.fn((): DropDisposition => ({ kind: "accepted" }));
    activeContainer = document.createElement("div");
    document.body.append(activeContainer);
    activeRoot = createRoot(activeContainer);

    act(() =>
      activeRoot?.render(
        <PointerDragDropSurface
          id="accepted-drop"
          decodeSource={(id) => ({ id })}
          renderOverlay={(source) => <span>{source.id}</span>}
          onDragEnd={onDragEnd}
        >
          <div>Board</div>
        </PointerDragDropSurface>,
      ),
    );

    const config = dndHarness.dropAnimation;
    expect(config).not.toBeNull();
    expect(typeof config).toBe("object");
    if (!config || typeof config === "function" || !config.keyframes) {
      throw new Error("Expected a configured drop-animation keyframe resolver");
    }
    const parameters = {
      transform: {
        initial: { x: 120, y: 80, scaleX: 1, scaleY: 1 },
        final: { x: 0, y: 0, scaleX: 1, scaleY: 1 },
      },
    } as Parameters<NonNullable<typeof config.keyframes>>[0];
    expect(config.keyframes(parameters)[0]).not.toEqual(config.keyframes(parameters)[1]);

    const startEvent = { active: { id: "card" } } as unknown as DragStartEvent;
    const endEvent = {
      active: { id: "card" },
      over: { id: "field" },
    } as unknown as DragEndEvent;
    act(() => dndHarness.contextProps?.onDragStart(startEvent));
    act(() => dndHarness.contextProps?.onDragEnd(endEvent));

    const keyframes = config.keyframes(parameters);

    expect(keyframes).toHaveLength(2);
    expect(keyframes[0]).toEqual(keyframes[1]);

    onDragEnd.mockReturnValue({ kind: "rejected" });
    act(() => dndHarness.contextProps?.onDragStart(startEvent));
    act(() => dndHarness.contextProps?.onDragEnd(endEvent));
    expect(config.keyframes(parameters)[0]).not.toEqual(config.keyframes(parameters)[1]);
    expect(onDragEnd).toHaveBeenCalledTimes(2);

    act(() => dndHarness.contextProps?.onDragStart(startEvent));
    act(() => dndHarness.contextProps?.onDragCancel());
    expect(onDragEnd).toHaveBeenCalledTimes(2);
    expect(config.keyframes(parameters)[0]).not.toEqual(config.keyframes(parameters)[1]);
  });
});
