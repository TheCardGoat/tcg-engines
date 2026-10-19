// @vitest-environment jsdom
import { act, createRef } from "react";
import { createRoot } from "react-dom/client";
import { expect, test, vi } from "vite-plus/test";
import { LandscapeNotice } from "./LandscapeNotice";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

test("consumer actions and the outer ref remain usable without an implied dismiss action", () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  const ref = createRef<HTMLDivElement>();
  const onPeek = vi.fn();
  try {
    act(() => root.render(<LandscapeNotice ref={ref} data-testid="notice" />));
    expect(ref.current).toBe(container.firstElementChild);
    expect(container.querySelector("button")).toBeNull();
    act(() =>
      root.render(
        <LandscapeNotice
          ref={ref}
          detail={null}
          actions={<button onClick={onPeek}>Peek</button>}
        />,
      ),
    );
    act(() => container.querySelector("button")?.click());
    expect(onPeek).toHaveBeenCalledOnce();
    expect(container.querySelector('[role="status"]')?.textContent).not.toContain("Peek");
    expect(container.textContent).not.toContain("Your match continues");
  } finally {
    act(() => root.unmount());
    container.remove();
  }
});
