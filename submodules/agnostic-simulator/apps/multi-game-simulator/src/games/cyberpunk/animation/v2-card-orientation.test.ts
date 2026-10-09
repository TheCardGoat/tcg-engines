import { expect, test } from "vite-plus/test";
import type { AnimationPlanV2 } from "@tcg/protocol";
import { omitUnmountedEntityStateChanges, projectV2CardOrientation } from "./v2-card-orientation";

function rotationDeg(step: AnimationPlanV2["steps"][number]): number {
  return "toRotationDeg" in step && typeof step.toRotationDeg === "number"
    ? step.toRotationDeg
    : Number.NaN;
}

test("V2 projects spending and readying without changing V1 or resources", () => {
  const plan: AnimationPlanV2 = {
    version: 2,
    id: "orientation",
    steps: [
      {
        id: "spend",
        type: "entityStateChange",
        entity: { kind: "entity", id: "unit" },
        change: "orientation",
        fromRotationDeg: 0,
        toRotationDeg: 90,
      },
      {
        id: "ready",
        type: "entityStateChange",
        entity: { kind: "entity", id: "unit" },
        change: "orientation",
        fromRotationDeg: 90,
        toRotationDeg: 0,
      },
      {
        id: "resource",
        type: "entityStateChange",
        entity: { kind: "entity", id: "eddie" },
        change: "orientation",
        fromRotationDeg: 0,
        toRotationDeg: 90,
      },
    ],
  };
  const result = projectV2CardOrientation(plan, new Set(["unit"]));
  // A spent card gets a small clockwise tilt rather than the full 90° turn.
  const tilt = rotationDeg(result.steps[0]!);
  expect(result.steps[0]).toMatchObject({ fromRotationDeg: 0 });
  expect(tilt).toBeGreaterThan(0);
  expect(tilt).toBeLessThan(90);
  // Readying returns through the same tilt back to upright.
  expect(result.steps[1]).toMatchObject({ fromRotationDeg: tilt, toRotationDeg: 0 });
  expect(result.steps[2]).toBe(plan.steps[2]);
  expect(plan.steps[0]).toMatchObject({ toRotationDeg: 90 });
});

test("V2 drops state changes for entities it never mounts, keeping all other steps", () => {
  const plan: AnimationPlanV2 = {
    version: 2,
    id: "unmounted",
    steps: [
      {
        id: "eddie-spend",
        type: "entityStateChange",
        entity: { kind: "entity", id: "eddie-1" },
        change: "orientation",
        fromRotationDeg: 0,
        toRotationDeg: 90,
      },
      {
        id: "legend-spend",
        type: "entityStateChange",
        entity: { kind: "entity", id: "legend-1" },
        change: "orientation",
        fromRotationDeg: 0,
        toRotationDeg: 90,
      },
      {
        id: "sell",
        type: "entityTransfer",
        entity: { kind: "entity", id: "eddie-1" },
        from: { kind: "zone", id: "p-hand" },
        to: { kind: "zone", id: "p-eddieArea" },
      },
      { id: "turn", type: "phaseChange", variant: "turn", turnNumber: 3 },
    ] as AnimationPlanV2["steps"],
  };
  const result = omitUnmountedEntityStateChanges(plan, new Set(["eddie-1", "eddie-2"]));
  // The unmounted Eddie flip is gone, but its transfer (the sell receipt
  // flight) and every mounted entity's motion stay in the plan.
  expect(result.steps.map((step) => step.id)).toEqual(["legend-spend", "sell", "turn"]);
  // The input plan is untouched.
  expect(plan.steps).toHaveLength(4);
});

test("V2 keeps the plan untouched when every entity is mounted", () => {
  const plan: AnimationPlanV2 = {
    version: 2,
    id: "mounted",
    steps: [
      {
        id: "unit-spend",
        type: "entityStateChange",
        entity: { kind: "entity", id: "unit-1" },
        change: "orientation",
      },
    ],
  };
  expect(omitUnmountedEntityStateChanges(plan, new Set())).toBe(plan);
});
