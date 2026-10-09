// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, test, vi } from "vite-plus/test";
import { CinematicStyleSchema, type CinematicStyle } from "@tcg/protocol/animations";
import { AnimationAnchor } from "../components/AnimationAnchor";
import { createSimulatorAnimationScope } from "../provider/createSimulatorAnimationScope";
import { cinematicPath } from "./CinematicEffect";
import { EffectConnectionsContext } from "./EffectOverlay";

test("chain geometry has finite endpoints, including coincident anchors", () => {
  expect(cinematicPath({ x: 5, y: 6 }, { x: 5, y: 6 }, true)).not.toMatch(/NaN|Infinity/);
  expect(cinematicPath({ x: 0, y: 0 }, { x: 300, y: 400 }, true)).toMatch(/^M 0 0 .*L 300 400$/);
});

async function exercise(
  style: CinematicStyle | "scene",
  mode: "finish" | "skip" | "sync" | "missing" | "off" | "reduced" | "unmount",
) {
  const motionGlobal = globalThis as typeof globalThis & {
    __TCG_TEST_DISABLE_SIMULATOR_MOTION__?: boolean;
  };
  const previous = motionGlobal.__TCG_TEST_DISABLE_SIMULATOR_MOTION__;
  motionGlobal.__TCG_TEST_DISABLE_SIMULATOR_MOTION__ = mode === "reduced";
  vi.stubGlobal("requestAnimationFrame", () => 1);
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(
    new DOMRect(100, 100, 80, 120),
  );
  const Scope = createSimulatorAnimationScope<number>();
  const source = { kind: "anchor", id: "source" } as const;
  const target = { kind: "anchor", id: "target" } as const;
  let idle: Promise<"idle" | "timeout"> | undefined;
  function Board() {
    const actions = Scope.useActions();
    const state = Scope.useState();
    return (
      <>
        <AnimationAnchor animationRef={source} />
        {mode !== "missing" && <AnimationAnchor animationRef={target} />}
        <span data-state>{state.presentationState}</span>
        <button
          onClick={() => {
            actions.enqueue({
              state: 1,
              version: 1,
              plan: {
                id: "test",
                version: 2,
                steps: [
                  {
                    id: "effect",
                    type: "effect",
                    ...(style === "scene"
                      ? {
                          scene: {
                            board: source,
                            tracks: [
                              {
                                id: "pulse",
                                kind: "area" as const,
                                begin: 0,
                                end: 1,
                                color: "#e0b967",
                                motion: "pulse" as const,
                                direction: "left" as const,
                              },
                            ],
                          },
                        }
                      : { cinematic: style }),
                    source,
                    targets: [target],
                    showText: false,
                    durationMs: 800,
                  },
                ],
              },
            });
            idle = actions.whenIdle(3000);
          }}
        >
          Play
        </button>
        <button onClick={() => actions.skipActive("test")}>Skip</button>
        <button onClick={() => actions.replaceFromSync({ state: 2, version: 2 })}>Sync</button>
      </>
    );
  }
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  let unmounted = false;
  try {
    await act(async () =>
      root.render(
        <EffectConnectionsContext.Provider
          value={({ connections }) => <span data-custom-count={connections.length} />}
        >
          <Scope.Root
            sessionKey="test"
            initialState={0}
            initialVersion={0}
            viewerSeatId={null}
            animationSpeed={mode === "off" ? "off" : "normal"}
            projection={{ getEntity: () => null, getZone: () => null }}
            entityRenderer={() => null}
          >
            <Board />
          </Scope.Root>
        </EffectConnectionsContext.Provider>,
      ),
    );
    await act(async () => host.querySelectorAll("button")[0]!.click());
    await act(async () => vi.advanceTimersByTime(300));
    if (mode !== "off" && mode !== "reduced") {
      expect(
        document.querySelector(
          style === "scene" ? "[data-cinematic-scene]" : `[data-cinematic-style="${style}"]`,
        ),
      ).not.toBeNull();
      expect(document.querySelectorAll("[data-cinematic-target]")).toHaveLength(
        style === "scene" || mode === "missing" ? 0 : 1,
      );
      // An optional game connection renderer must not double-render the new effect.
      expect(document.querySelector("[data-custom-count]")?.getAttribute("data-custom-count")).toBe(
        "0",
      );
      expect(document.querySelector("[data-animation-effect-arrow]")).toBeNull();
    }
    if (mode === "skip" || mode === "sync")
      await act(async () => host.querySelectorAll("button")[mode === "skip" ? 1 : 2]!.click());
    if (mode === "unmount") {
      await act(async () => root.unmount());
      unmounted = true;
    }
    await act(async () => vi.advanceTimersByTime(2000));
    await act(async () => vi.advanceTimersByTime(100));
    expect(document.querySelector("[data-cinematic-style], [data-cinematic-scene]")).toBeNull();
    if (!unmounted) {
      expect(await idle).toBe("idle");
      expect(host.querySelector("[data-state]")?.textContent).toBe(mode === "sync" ? "2" : "1");
    }
  } finally {
    if (!unmounted) await act(async () => root.unmount());
    host.remove();
    motionGlobal.__TCG_TEST_DISABLE_SIMULATOR_MOTION__ = previous;
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  }
}

test.each(CinematicStyleSchema.options)(
  "%s uses the shared lifecycle and clears after playback",
  (style) => exercise(style, "finish"),
);
test.each(["skip", "sync", "missing", "off", "reduced", "unmount"] as const)(
  "projectile handles %s without stale overlays",
  (mode) => exercise("projectile", mode),
);

test.each(["finish", "skip", "sync", "missing", "off", "reduced", "unmount"] as const)(
  "complete scene respects driver %s",
  (mode) => exercise("scene", mode),
);
