// @vitest-environment jsdom
import { act, useEffect, useState, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, expect, test, vi } from "vite-plus/test";
import { AnimatedEntityCollection } from "./AnimatedEntityCollection";
import { AnimationRuntimeContext, type AnimationRuntimeContextValue } from "../provider/contexts";
import { createAnimationNodeRegistry } from "../lib/node-registry";

let root: Root | undefined;
let container: HTMLDivElement;
afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
});
function render(node: ReactNode) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  const rerender = (next: ReactNode) => act(() => root?.render(next));
  rerender(node);
  return { rerender };
}
const idle: AnimationRuntimeContextValue = {
  scopeId: "test",
  speed: "normal",
  spatialMotionSuppressed: false,
  viewerSeatId: "player",
  compiledPlan: null,
  activeTransition: null,
  registry: createAnimationNodeRegistry(),
  entityRenderer: () => null,
  getEntity: () => null,
  getZone: () => null,
};
test("preserves card identity, local state and focus from idle through animation and back", () => {
  const mount = vi.fn();
  const unmount = vi.fn();
  function Card() {
    const [count, setCount] = useState(0);
    useEffect(() => {
      mount();
      return unmount;
    }, []);
    return <button onClick={() => setCount((n) => n + 1)}>Selected {count}</button>;
  }
  const content = (runtime: AnimationRuntimeContextValue) => (
    <AnimationRuntimeContext.Provider value={runtime}>
      <AnimatedEntityCollection>
        <Card key="card" />
      </AnimatedEntityCollection>
    </AnimationRuntimeContext.Provider>
  );
  const view = render(content(idle));
  const card = container.querySelector<HTMLButtonElement>("button")!;
  act(() => card.click());
  card.focus();
  for (const phase of ["preparing", "running", "reflowing"] as const) {
    view.rerender(
      content({
        ...idle,
        activeTransition: {
          id: "move",
          phase,
          source: "local",
          fromState: {},
          toState: {},
          fromVersion: 0,
          toVersion: 1,
          plan: { id: "plan", version: 2, steps: [] },
        },
      }),
    );
    expect(container.querySelector<HTMLButtonElement>("button")!).toBe(card);
    expect(card.textContent).toBe("Selected 1");
    expect(document.activeElement).toBe(card);
  }
  view.rerender(content(idle));
  expect(container.querySelector<HTMLButtonElement>("button")!).toBe(card);
  expect(mount).toHaveBeenCalledTimes(1);
  expect(unmount).not.toHaveBeenCalled();
});

test("updates an idle collection without retaining removed nonanimated cards", () => {
  const content = (ids: string[]) => (
    <AnimationRuntimeContext.Provider value={idle}>
      <AnimatedEntityCollection>
        {ids.map((id) => (
          <div key={id}>{id}</div>
        ))}
      </AnimatedEntityCollection>
    </AnimationRuntimeContext.Provider>
  );
  const view = render(content(["first", "second"]));
  view.rerender(content(["second"]));
  expect(container.textContent).not.toContain("first");
  expect(container.textContent).toBe("second");
});
