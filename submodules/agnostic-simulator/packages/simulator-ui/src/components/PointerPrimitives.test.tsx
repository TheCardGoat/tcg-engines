// @vitest-environment jsdom
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test, vi } from "vite-plus/test";

vi.mock("@dnd-kit/core", () => ({
  useDraggable: ({ disabled }: { disabled?: boolean }) => ({
    attributes: {
      role: "button",
      tabIndex: 0,
      "aria-roledescription": "draggable",
      "aria-disabled": disabled || undefined,
    },
    listeners: { onPointerDown: () => undefined, onKeyDown: () => undefined },
    setNodeRef: () => undefined,
    transform: { x: 12, y: 8 },
    isDragging: true,
  }),
  useDroppable: ({ disabled }: { disabled?: boolean }) => ({
    setNodeRef: () => undefined,
    isOver: !disabled,
  }),
}));

import { PointerDraggable } from "./PointerDraggable";
import { PointerDroppable } from "./PointerDroppable";

describe("pointer drag primitives", () => {
  test("exposes dnd-kit pointer and keyboard attributes without imposing visuals", () => {
    const markup = renderToStaticMarkup(
      <PointerDraggable id="card:1" className="game-card" style={{ rotate: "90deg" }}>
        {({ isDragging }) => <span>{isDragging ? "dragging" : "idle"}</span>}
      </PointerDraggable>,
    );
    expect(markup).toContain('class="game-card"');
    expect(markup).toContain('role="button"');
    expect(markup).toContain('tabindex="0"');
    expect(markup).toContain('data-dragging="true"');
    expect(markup).toContain("translate3d(12px, 8px, 0)");
    expect(markup).toContain("dragging");
  });

  test("reports hover state to a game-owned drop target", () => {
    const markup = renderToStaticMarkup(
      <PointerDroppable id="zone:play">
        {({ isOver }) => <span>{isOver ? "ready" : "idle"}</span>}
      </PointerDroppable>,
    );
    expect(markup).toContain('data-drop-over="true"');
    expect(markup).toContain("ready");
  });

  test("keeps the source stationary when an overlay owns the moving visual", () => {
    const markup = renderToStaticMarkup(
      <PointerDraggable id="card:1" transformBehavior="overlay-only" style={{ rotate: "90deg" }}>
        Card
      </PointerDraggable>,
    );

    expect(markup).not.toContain("translate3d");
    expect(markup).toContain("rotate:90deg");
    expect(markup).toContain('data-dragging="true"');
    expect(markup).toContain('role="button"');
  });

  test("exposes disabled drag and drop state accessibly", () => {
    const draggable = renderToStaticMarkup(
      <PointerDraggable id="card:1" disabled>
        Card
      </PointerDraggable>,
    );
    const droppable = renderToStaticMarkup(
      <PointerDroppable id="zone:play" disabled>
        Zone
      </PointerDroppable>,
    );
    expect(draggable).toContain('aria-disabled="true"');
    expect(draggable).toContain('data-drag-disabled="true"');
    expect(droppable).toContain('data-drop-disabled="true"');
    expect(droppable).not.toContain("data-drop-over");
  });
});
