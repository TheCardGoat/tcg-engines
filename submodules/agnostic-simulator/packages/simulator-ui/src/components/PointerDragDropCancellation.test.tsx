// @vitest-environment jsdom
import { act, createRef } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vite-plus/test";
import { PointerDragDropSurface } from "./PointerDragDropSurface";
import { PointerDraggable } from "./PointerDraggable";

it("cancels an active mouse sensor on an authoritative update without replacing the focused board", () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  const cancelled = vi.fn();
  const focus = createRef<HTMLButtonElement>();
  const board = (version: number) => (
    <PointerDragDropSurface
      id="cancel-test"
      cancelKey={version}
      decodeSource={(id) => id}
      renderOverlay={(id) => <span>{id}</span>}
      onDragCancel={cancelled}
    >
      <button ref={focus}>Pass</button>
      <PointerDraggable id="card" data-testid="draggable">
        <button>Card</button>
      </PointerDraggable>
    </PointerDragDropSurface>
  );
  try {
    act(() => root.render(board(1)));
    const original = focus.current;
    const card = container.querySelector('[data-testid="draggable"]')!;
    act(() =>
      card.dispatchEvent(
        new MouseEvent("mousedown", { bubbles: true, button: 0, clientX: 5, clientY: 5 }),
      ),
    );
    act(() =>
      document.dispatchEvent(
        new MouseEvent("mousemove", { bubbles: true, clientX: 30, clientY: 30 }),
      ),
    );
    expect(card.getAttribute("data-dragging")).toBe("true");
    original!.focus();
    act(() => root.render(board(2)));
    expect(cancelled).toHaveBeenCalledTimes(1);
    expect(card.getAttribute("data-dragging")).toBeNull();
    expect(focus.current).toBe(original);
    expect(document.activeElement).toBe(original);
  } finally {
    act(() => root.unmount());
    container.remove();
  }
});
