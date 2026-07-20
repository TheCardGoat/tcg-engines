// @vitest-environment jsdom
import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

interface CapturedDndContextProps {
  readonly id: string;
  readonly children: ReactNode;
  readonly onDragStart: (event: DragStartEvent) => void;
  readonly onDragCancel: () => void;
  readonly onDragEnd: (event: DragEndEvent) => void;
}

const dndHarness = vi.hoisted(() => ({
  contextProps: null as CapturedDndContextProps | null,
}));

vi.mock("@dnd-kit/core", () => ({
  DndContext: (props: CapturedDndContextProps) => {
    dndHarness.contextProps = props;
    return props.children;
  },
  DragOverlay: ({ children }: { readonly children: ReactNode }) => children,
  KeyboardSensor: function KeyboardSensor() {},
  PointerSensor: function PointerSensor() {},
  defaultDropAnimationSideEffects: () => () => undefined,
  useDndMonitor: () => undefined,
  useSensor: (sensor: unknown, options?: unknown) => ({ sensor, options }),
  useSensors: (...sensors: unknown[]) => sensors,
}));

import { PointerDragDropSurface } from "./PointerDragDropSurface";

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
});

describe("PointerDragDropSurface", () => {
  test("keeps source decoding generic while owning the drag lifecycle and overlay", () => {
    const onDragStart = vi.fn();
    const onDragCancel = vi.fn();
    const onDragEnd = vi.fn();
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
});
