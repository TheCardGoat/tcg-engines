// @vitest-environment jsdom
import { describe, expect, test } from "vite-plus/test";
import type { AnimationPlanV1 } from "@tcg/protocol";
import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";

import { emptyRectCache } from "./rectRegistry.js";
import { planStepToOverlay } from "./planStepToOverlay.js";

describe("planStepToOverlay", () => {
  test("centers phase overlays on the simulator board", () => {
    document.body.innerHTML =
      '<main class="motion-animation-stage"><div data-sim-board></div></main>';
    const board = document.querySelector<HTMLElement>("[data-sim-board]");
    expect(board).toBeTruthy();
    Object.defineProperty(board, "getBoundingClientRect", {
      value: () => ({
        left: 40,
        top: 20,
        width: 500,
        height: 300,
        right: 540,
        bottom: 320,
        x: 40,
        y: 20,
        toJSON: () => ({}),
      }),
    });
    const plan: AnimationPlanV1 = {
      id: "phase-plan",
      version: 1,
      anchors: [],
      steps: [{ id: "phase-step", type: "phaseChange", from: "main", to: "start" }],
    };

    const overlay = planStepToOverlay({
      plan,
      step: plan.steps[0]!,
      cache: emptyRectCache(),
      viewerSeatId: "player-1",
    });

    expect(overlay).toMatchObject({
      type: "phase",
      overlay: {
        center: { x: 290, y: 170 },
        variant: "phase",
      },
    });
  });

  test("preserves turn phase metadata", () => {
    const plan: AnimationPlanV1 = {
      id: "turn-plan",
      version: 1,
      anchors: [],
      steps: [
        {
          id: "turn-step",
          type: "phaseChange",
          from: "main",
          to: "start",
          variant: "turn",
          player: { kind: "player", id: "player-2" },
          turnNumber: 2,
        },
      ],
    };

    const overlay = planStepToOverlay({
      plan,
      step: plan.steps[0]!,
      cache: emptyRectCache(),
      viewerSeatId: "player-1",
    });

    expect(overlay).toMatchObject({
      type: "phase",
      overlay: {
        variant: "turn",
        playerId: "player-2",
        viewerSeatId: "player-1",
        turnNumber: 2,
      },
    });
  });

  test("uses explicit face overrides for staged card reveals", () => {
    const cache = emptyRectCache();
    cache.byZoneEntityId.set("p-legendArea::legend-1", {
      left: 10,
      top: 20,
      width: 50,
      height: 70,
    });
    cache.byAnchorId.set("resolving-program:legend-1", {
      left: 100,
      top: 120,
      width: 60,
      height: 84,
    });

    const entity: SimulatorEntity = {
      id: "legend-1",
      title: "Called Legend",
      subtitle: "legend",
      kind: "leader",
      ownerId: "player-1",
      face: "public",
      states: [],
      stats: [],
      traits: [],
      imageUrl: "legend.webp",
      backImageUrl: "legend-back.webp",
    };
    const zone: SimulatorZone = {
      id: "p-legendArea",
      label: "Legends",
      role: "leader",
      ownerId: "player-1",
      visibility: "private",
      entityIds: ["legend-1"],
      hint: "Legends",
    };
    const plan: AnimationPlanV1 = {
      id: "reveal",
      version: 1,
      anchors: [],
      steps: [
        {
          id: "to-resolution",
          type: "moveEntity",
          entity: { kind: "entity", id: "legend-1" },
          from: { kind: "zone", id: "p-legendArea", ownerId: "player-1" },
          to: { kind: "anchor", id: "resolving-program:legend-1" },
          sourceFace: "hidden",
          destinationFace: "hidden",
        },
      ],
    };

    const overlay = planStepToOverlay({
      plan,
      step: plan.steps[0]!,
      cache,
      viewerSeatId: "player-1",
      resolveEntity: () => entity,
      resolveZone: () => zone,
    });

    expect(overlay).toMatchObject({
      type: "card",
      overlay: {
        sourceFace: "hidden",
        destinationFace: "hidden",
      },
    });
  });
});
