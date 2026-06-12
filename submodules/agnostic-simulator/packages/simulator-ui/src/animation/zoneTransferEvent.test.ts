import { describe, expect, test } from "bun:test";
import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";

import type { SimulatorAnimationEvent } from "./events.js";
import { toZoneTransferAnimationStep } from "./zoneTransferEvent.js";

const entity: SimulatorEntity = {
  id: "runner",
  title: "Runner",
  subtitle: "Unit",
  kind: "unit",
  ownerId: "p1",
  face: "public",
  states: [],
  stats: [],
  traits: [],
};

const hand: SimulatorZone = {
  id: "p-hand",
  label: "Hand",
  role: "hand",
  ownerId: "p1",
  visibility: "private",
  entityIds: [entity.id],
  hint: "Hand",
};

const field: SimulatorZone = {
  id: "p-field",
  label: "Field",
  role: "battlefield",
  ownerId: "p1",
  visibility: "public",
  entityIds: [],
  hint: "Field",
};

describe("toZoneTransferAnimationStep", () => {
  test("maps shared zoneTransfer events to the existing transfer animator step shape", () => {
    const step = toZoneTransferAnimationStep({
      id: "move-1",
      primitive: "zoneTransfer",
      entity,
      fromZone: hand,
      toZone: field,
      viewer: { viewerSeatId: "p1" },
      delayMs: 12,
      durationMs: 240,
    });

    expect(step).toEqual({
      id: "move-1",
      kind: "move-zone",
      entity,
      fromZone: hand,
      toZone: field,
      viewerSeatId: "p1",
      delayMs: 12,
      durationMs: 240,
    });
  });

  test("maps draw events to draw transfer steps", () => {
    expect(
      toZoneTransferAnimationStep({
        id: "draw-1",
        primitive: "draw",
        entity,
        fromZone: { ...hand, id: "p-deck", role: "deck", visibility: "secret" },
        toZone: hand,
        viewer: { viewerSeatId: "p1" },
      })?.kind,
    ).toBe("draw");
  });

  test("does not force unsupported primitives into transfer animation", () => {
    const event: SimulatorAnimationEvent = {
      id: "flip-1",
      primitive: "flipReveal",
      entity,
      zone: field,
      viewer: { viewerSeatId: "p1" },
    };

    expect(toZoneTransferAnimationStep(event)).toBeNull();
  });
});
