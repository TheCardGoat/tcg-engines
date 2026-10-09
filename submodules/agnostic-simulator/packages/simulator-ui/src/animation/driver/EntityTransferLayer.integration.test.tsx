// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import type { AnimationPlanV2 } from "@tcg/protocol/animations";
import { compileAnimationPlan } from "@tcg/simulator-runtime/animation";
import type { SimulatorEntity } from "@tcg/simulator-contract";
import { afterEach, describe, expect, it } from "vite-plus/test";

import { createAnimationNodeRegistry } from "../lib/node-registry";
import { AnimationRuntimeContext, type AnimationRuntimeContextValue } from "../provider/contexts";
import { EntityTransferLayer } from "./EntityTransferLayer";

const entity: SimulatorEntity = {
  id: "card-1",
  title: "Card",
  subtitle: "",
  kind: "card",
  ownerId: "p1",
  face: "public",
  states: [],
  stats: [],
  traits: [],
};
const plan: AnimationPlanV2 = {
  id: "draw",
  version: 2,
  steps: [
    {
      id: "draw-1",
      type: "entityTransfer",
      entity: { kind: "entity", id: "card-1" },
      from: { kind: "zone", id: "p-deck", ownerId: "p1" },
      to: { kind: "zone", id: "p-hand", ownerId: "p1" },
      durationMs: 800,
      sourceFace: "public",
      destinationFace: "hidden",
    },
  ],
};

function zoneNode(left: number): HTMLElement {
  const node = document.createElement("div");
  node.getBoundingClientRect = () => ({
    left,
    top: 100,
    width: 60,
    height: 84,
    right: left + 60,
    bottom: 184,
    x: left,
    y: 100,
    toJSON: () => ({}),
  });
  return node;
}

let root: Root | undefined;
let container: HTMLDivElement | undefined;

function setup(withDestination: boolean, dragOrigin?: DOMRect) {
  const registry = createAnimationNodeRegistry();
  if (dragOrigin) registry.setDragOrigin(entity.id, dragOrigin);
  registry.register({
    key: "source",
    ref: { kind: "zone", id: "p-deck", ownerId: "p1" },
    node: zoneNode(20),
    presence: "exiting",
  });
  if (withDestination)
    registry.register({
      key: "destination",
      ref: { kind: "zone", id: "p-hand", ownerId: "p1" },
      node: zoneNode(400),
      presence: "present",
    });
  const runtime: AnimationRuntimeContextValue = {
    scopeId: "test",
    speed: "normal",
    spatialMotionSuppressed: false,
    viewerSeatId: "p1",
    compiledPlan: compileAnimationPlan(plan),
    activeTransition: {
      id: "draw",
      source: "authoritative",
      fromState: {},
      toState: {},
      fromVersion: 1,
      toVersion: 2,
      plan,
      phase: "running",
    },
    registry,
    entityRenderer: () => null,
    spatialTransferRenderer: ({ transfers }) => (
      <div
        data-testid="captured"
        data-source-pose-left={transfers[0]?.sourcePose?.rect.left}
        data-source-pose-rotation={transfers[0]?.sourcePose?.rotationDeg}
      >
        {transfers.length}
      </div>
    ),
    getEntity: () => entity,
    getZone: () => null,
  };
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() =>
    root?.render(
      <AnimationRuntimeContext.Provider value={runtime}>
        <EntityTransferLayer />
      </AnimationRuntimeContext.Provider>,
    ),
  );
  return registry;
}

afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
  root = undefined;
  container = undefined;
});

describe("EntityTransferLayer capture", () => {
  it("keeps a released drag pose instead of returning to the original hand slot", () => {
    setup(true, new DOMRect(232, 198, 100, 140));
    const captured = document.querySelector('[data-testid="captured"]');
    expect(captured?.getAttribute("data-source-pose-left")).toBe("232");
    expect(captured?.getAttribute("data-source-pose-rotation")).toBe("0");
  });
  it("captures ready endpoints in the running commit without waiting for a frame", () => {
    setup(true);
    expect(document.querySelector('[data-testid="captured"]')?.textContent).toBe("1");
  });

  it("retries when the destination registers after the transition starts", () => {
    const registry = setup(false);
    expect(document.querySelector('[data-testid="captured"]')?.textContent).toBe("0");
    act(() => {
      registry.register({
        key: "destination",
        ref: { kind: "zone", id: "p-hand", ownerId: "p1" },
        node: zoneNode(400),
        presence: "present",
      });
    });
    expect(document.querySelector('[data-testid="captured"]')?.textContent).toBe("1");
  });
});
