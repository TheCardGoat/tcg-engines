// @vitest-environment jsdom
import { act, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { expect, test } from "vite-plus/test";
import { AnimatedZoneSlot } from "./components/AnimatedZoneSlot";
import { createSimulatorAnimationScope } from "./provider/createSimulatorAnimationScope";
import type { SimulatorSpatialTransferRendererProps } from "./provider/contexts";

test("retains graphics resources across transfers and clears their input while idle", async () => {
  const Animation = createSimulatorAnimationScope<{ turn: number }>();
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  let mounts = 0;
  let disposals = 0;
  let activeTransfers = 0;
  function Renderer({ transfers }: SimulatorSpatialTransferRendererProps) {
    activeTransfers = transfers.length;
    useEffect(() => {
      mounts++;
      return () => {
        disposals++;
      };
    }, []);
    return <output data-persistent-renderer="">{transfers.length}</output>;
  }
  function Controls() {
    const actions = Animation.useActions();
    const snapshot = Animation.useState();
    const version = snapshot.authoritativeVersion;
    if (version === null) throw new Error("Expected an initialized animation session");
    return (
      <>
        <AnimatedZoneSlot animationRef={{ kind: "zone", id: "deck" }}>Deck</AnimatedZoneSlot>
        <AnimatedZoneSlot animationRef={{ kind: "zone", id: "hand" }}>Hand</AnimatedZoneSlot>
        <button
          onClick={() =>
            actions.enqueue({
              state: { turn: version + 1 },
              version: version + 1,
              plan: {
                id: `draw-${snapshot.authoritativeVersion}`,
                version: 2,
                steps: [
                  {
                    id: "draw",
                    type: "entityTransfer",
                    entity: { kind: "entity", id: "card" },
                    from: { kind: "zone", id: "deck" },
                    to: { kind: "zone", id: "hand" },
                    sourceFace: "hidden",
                    destinationFace: "public",
                    durationMs: 200,
                  },
                ],
              },
            })
          }
        >
          Draw
        </button>
      </>
    );
  }
  try {
    await act(async () =>
      root.render(
        <Animation.Root
          sessionKey="persistent-renderer"
          initialState={{ turn: 1 }}
          initialVersion={1}
          projection={{
            getEntity: () => ({
              id: "card",
              title: "Card",
              subtitle: "",
              kind: "card",
              ownerId: "p1",
              face: "public",
              states: [],
              stats: [],
              traits: [],
            }),
            getZone: () => null,
          }}
          entityRenderer={() => null}
          spatialTransferRenderer={Renderer}
          viewerSeatId="p1"
          animationSpeed="normal"
        >
          <Controls />
        </Animation.Root>,
      ),
    );
    expect(mounts).toBe(1);
    for (let i = 0; i < 2; i++) {
      await act(async () => host.querySelector("button")!.click());
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 60));
      });
      expect(activeTransfers).toBe(1);
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 400));
      });
      expect(activeTransfers).toBe(0);
      expect(mounts).toBe(1);
      expect(disposals).toBe(0);
      expect(document.querySelector("[data-animation-transfer-layer]")).toBeNull();
    }
  } finally {
    await act(async () => root.unmount());
    host.remove();
  }
  expect(disposals).toBe(1);
});
