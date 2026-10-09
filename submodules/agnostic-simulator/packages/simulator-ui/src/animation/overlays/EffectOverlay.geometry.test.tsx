import { EffectConnectionsContext, type EffectArrowProps } from "./EffectOverlay";
// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, test, vi } from "vite-plus/test";
import type { SimulatorEntity } from "@tcg/simulator-contract";
import { AnimatedEntitySlot } from "../components/AnimatedEntitySlot";
import { createSimulatorAnimationScope } from "../provider/createSimulatorAnimationScope";

const target: SimulatorEntity = {
  id: "target",
  title: "Target",
  subtitle: "",
  kind: "card",
  ownerId: "p1",
  face: "public",
  states: [],
  stats: [],
  traits: [],
};
const source: SimulatorEntity = {
  ...target,
  id: "source",
  title: "Source",
  imageAspectRatio: 0.714,
};

function SampleConnections({ connections }: { connections: readonly EffectArrowProps[] }) {
  return (
    <>
      {connections.map((c) => (
        <output
          key={c.id}
          data-custom-effect=""
          data-source={c.sourceId}
          data-x={c.destination.x}
          data-y={c.destination.y}
          data-duration={c.durationMs}
        />
      ))}
    </>
  );
}

test.each(["field", "legends", "eddies", "hand", "custom"])(
  "keeps effect arrows at the %s origin after a target moves to trash",
  async (origin) => {
    const motionGlobal = globalThis as typeof globalThis & {
      __TCG_TEST_DISABLE_SIMULATOR_MOTION__?: boolean;
    };
    const previousMotion = motionGlobal.__TCG_TEST_DISABLE_SIMULATOR_MOTION__;
    motionGlobal.__TCG_TEST_DISABLE_SIMULATOR_MOTION__ = false;
    vi.stubGlobal("requestAnimationFrame", () => 1);
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      function (this: HTMLElement) {
        const left = this.dataset.testZone === "trash" ? 800 : 100;
        return new DOMRect(left, 200, 80, 120);
      },
    );
    const Animation = createSimulatorAnimationScope<{ zone: string }>();
    function Board() {
      const actions = Animation.useActions();
      const state = Animation.useState();
      const zone = state.presentationState?.zone ?? origin;
      const version = state.authoritativeVersion ?? 1;
      return (
        <>
          <AnimatedEntitySlot
            key={zone}
            entity={target}
            density="normal"
            zoneRef={{ kind: "zone", id: zone }}
            data-test-zone={zone}
          >
            {zone}: Target
          </AnimatedEntitySlot>
          <button
            onClick={() =>
              actions.enqueue({
                state: { zone: zone === origin ? "trash" : origin },
                version: version + 1,
                plan: {
                  version: 2,
                  id: `effect-${version}`,
                  steps: [
                    {
                      id: "effect",
                      type: "effect",
                      source: { kind: "entity", id: "source" },
                      targets: [{ kind: "entity", id: "target" }],
                      presentation: "source-card",
                      durationMs: 1000,
                    },
                  ],
                },
              })
            }
          >
            Move target
          </button>
        </>
      );
    }
    const host = document.createElement("div");
    document.body.append(host);
    const root = createRoot(host);
    try {
      await act(async () =>
        root.render(
          <EffectConnectionsContext.Provider value={origin === "custom" ? SampleConnections : null}>
            <Animation.Root
              sessionKey={`origin-${origin}`}
              initialState={{ zone: origin }}
              initialVersion={1}
              viewerSeatId="p1"
              animationSpeed="normal"
              projection={{
                getEntity: (_state, id) => (id === "source" ? source : target),
                getZone: () => null,
              }}
              entityRenderer={({ entity }) => <div>{entity.title}</div>}
            >
              <Board />
            </Animation.Root>
          </EffectConnectionsContext.Provider>,
        ),
      );
      for (const [expectedZone, expectedX] of [
        ["trash", 140],
        [origin, 840],
      ] as const) {
        await act(async () => host.querySelector("button")!.click());
        await act(async () => vi.advanceTimersByTime(300));
        expect(host.textContent).toContain(`${expectedZone}: Target`);
        expect(
          document.querySelector<HTMLElement>('[data-animation-overlay="source-card-effect"]')
            ?.style.aspectRatio,
        ).toBe("0.714 / 1");
        const path = document.querySelector("[data-animation-effect-arrow] path");
        if (origin === "custom") {
          const custom = document.querySelector("[data-custom-effect]");
          expect(custom?.getAttribute("data-x")).toBe(String(expectedX));
          expect(custom?.getAttribute("data-source")).toBe("source");
          expect(custom?.getAttribute("data-duration")).toBe("273");
          expect(path).toBeNull();
          expect(
            document.querySelector('[data-animation-overlay="source-card-effect"]'),
          ).not.toBeNull();
        } else expect(path?.getAttribute("d")).toMatch(new RegExp(`L ${expectedX} 260$`));
        if (origin === "custom") {
          vi.stubGlobal("scrollY", 180);
          await act(async () => window.dispatchEvent(new Event("scroll")));
          expect(document.querySelector("[data-custom-effect]")?.getAttribute("data-y")).toBe("80");
          vi.stubGlobal("scrollY", 0);
          await act(async () => window.dispatchEvent(new Event("scroll")));
          expect(document.querySelector("[data-custom-effect]")?.getAttribute("data-y")).toBe(
            "260",
          );
        }
        expect(document.querySelector("[data-animation-effect-target]")).toBeNull();
        await act(async () => vi.advanceTimersByTime(2000));
        await act(async () => vi.advanceTimersByTime(2000));
      }
    } finally {
      await act(async () => root.unmount());
      host.remove();
      motionGlobal.__TCG_TEST_DISABLE_SIMULATOR_MOTION__ = previousMotion;
      vi.restoreAllMocks();
      vi.unstubAllGlobals();
      vi.useRealTimers();
    }
  },
);
