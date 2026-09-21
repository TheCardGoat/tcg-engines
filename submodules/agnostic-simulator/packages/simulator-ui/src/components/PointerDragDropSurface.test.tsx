// @vitest-environment jsdom
import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import type { DragEndEvent, DragStartEvent, DropAnimation } from "@dnd-kit/core";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

interface CapturedDndContextProps {
  readonly id: string;
  readonly children: ReactNode;
  readonly sensors: readonly { sensor: unknown; options?: unknown }[];
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
  PointerSensor: function PointerSensor() {},
  defaultDropAnimationSideEffects: () => () => undefined,
  useDndMonitor: () => undefined,
  useSensor: (sensor: unknown, options?: unknown) => ({ sensor, options }),
  useSensors: (...sensors: unknown[]) => sensors,
}));

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
    expect(dndHarness.contextProps?.sensors).toHaveLength(2);
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
