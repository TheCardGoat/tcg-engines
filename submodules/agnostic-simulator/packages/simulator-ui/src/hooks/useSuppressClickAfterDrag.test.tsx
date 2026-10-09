// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

import { useSuppressClickAfterDrag } from "./useSuppressClickAfterDrag";

function ClickableDragSource({
  isDragging,
  onClick,
}: {
  readonly isDragging: boolean;
  readonly onClick: () => void;
}) {
  const { resetOnPointerDown, suppressOnClick } = useSuppressClickAfterDrag(isDragging);
  return (
    <button
      type="button"
      onPointerDownCapture={resetOnPointerDown}
      onClickCapture={suppressOnClick}
      onClick={onClick}
    >
      Card
    </button>
  );
}

describe("useSuppressClickAfterDrag", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  test("suppresses the click emitted after a drag but preserves later clicks", () => {
    const onClick = vi.fn();
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    const renderSource = (isDragging: boolean) => {
      act(() => root.render(<ClickableDragSource isDragging={isDragging} onClick={onClick} />));
    };
    const button = () => container.querySelector<HTMLButtonElement>("button")!;

    renderSource(false);
    act(() => {
      button().dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
      button().click();
    });
    expect(onClick).toHaveBeenCalledOnce();

    renderSource(true);
    renderSource(false);
    act(() => button().click());
    expect(onClick).toHaveBeenCalledOnce();

    act(() => {
      button().dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
      button().click();
    });
    expect(onClick).toHaveBeenCalledTimes(2);

    act(() => root.unmount());
  });
});
