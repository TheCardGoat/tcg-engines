import { describe, expect, test } from "bun:test";
import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";

import {
  isPrimitiveOverlayEvent,
  primitiveOverlayKind,
  resolvePrimitiveOverlayFaces,
} from "./primitiveEvent.js";

const entity: SimulatorEntity = {
  id: "gear",
  title: "Gear",
  subtitle: "Upgrade",
  kind: "card",
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
  entityIds: [entity.id],
  hint: "Field",
};

describe("primitive overlay event helpers", () => {
  test("recognizes non-transfer shared primitive events", () => {
    expect(
      isPrimitiveOverlayEvent({
        id: "exit-1",
        primitive: "zoneExit",
        entity,
        fromZone: field,
        viewer: { viewerSeatId: "p1" },
      }),
    ).toBe(true);

    expect(
      isPrimitiveOverlayEvent({
        id: "move-1",
        primitive: "zoneTransfer",
        entity,
        fromZone: hand,
        toZone: field,
        viewer: { viewerSeatId: "p1" },
      }),
    ).toBe(false);
  });

  test("maps primitive names to stable overlay kinds", () => {
    expect(
      primitiveOverlayKind({
        id: "attach-1",
        primitive: "attach",
        entity,
        fromZone: hand,
        toZone: field,
        targetEntityId: "host",
        viewer: { viewerSeatId: "p1" },
      }),
    ).toBe("attach");
  });

  test("resolves attach visibility from source and destination zones", () => {
    const ownerPlan = resolvePrimitiveOverlayFaces({
      id: "attach-owner",
      primitive: "attach",
      entity,
      fromZone: hand,
      toZone: field,
      targetEntityId: "host",
      viewer: { viewerSeatId: "p1" },
    });
    const opponentPlan = resolvePrimitiveOverlayFaces({
      id: "attach-opponent",
      primitive: "attach",
      entity,
      fromZone: hand,
      toZone: field,
      targetEntityId: "host",
      viewer: { viewerSeatId: "p2" },
    });

    expect(ownerPlan.sourceFace).toBe("public");
    expect(ownerPlan.destinationFace).toBe("public");
    expect(opponentPlan.sourceFace).toBe("hidden");
    expect(opponentPlan.destinationFace).toBe("public");
  });

  test("reveals public faces only to viewers allowed by the reveal zone", () => {
    const ownerPlan = resolvePrimitiveOverlayFaces({
      id: "flip-owner",
      primitive: "flipReveal",
      entity,
      zone: hand,
      viewer: { viewerSeatId: "p1" },
    });
    const opponentPlan = resolvePrimitiveOverlayFaces({
      id: "flip-opponent",
      primitive: "flipReveal",
      entity,
      zone: hand,
      viewer: { viewerSeatId: "p2" },
    });

    expect(ownerPlan.sourceFace).toBe("hidden");
    expect(ownerPlan.destinationFace).toBe("public");
    expect(opponentPlan.sourceFace).toBe("hidden");
    expect(opponentPlan.destinationFace).toBe("hidden");
  });
});
