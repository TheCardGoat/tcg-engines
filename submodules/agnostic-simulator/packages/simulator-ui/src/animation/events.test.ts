import { describe, expect, test } from "bun:test";
import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";

import {
  projectEntityForZoneViewer,
  redactEntityForHiddenZone,
  resolveAnimationCardFaceForViewer,
} from "./events.js";

const entity: SimulatorEntity = {
  id: "entity-1",
  title: "Visible Name",
  subtitle: "Visible Type",
  kind: "unit",
  ownerId: "owner-seat",
  face: "public",
  states: ["ready"],
  stats: [{ label: "Cost", value: "3" }],
  traits: ["Runner"],
  imageUrl: "https://example.test/card.webp",
  backImageUrl: "https://example.test/back.webp",
  frameStyle: { color: "#ff0099", pattern: "stripe" },
  overlayBadges: [{ label: "+1", color: "green", position: "tr" }],
  spawnAnimation: "flip",
};

function zone(visibility: SimulatorZone["visibility"], ownerId = "owner-seat"): SimulatorZone {
  return {
    id: `${visibility}-zone`,
    label: `${visibility} zone`,
    role: "hand",
    ownerId,
    visibility,
    entityIds: [entity.id],
    hint: "Test zone",
  };
}

describe("resolveAnimationCardFaceForViewer", () => {
  test("public zones show the card face to every viewer", () => {
    expect(
      resolveAnimationCardFaceForViewer({
        entity,
        zone: zone("public"),
        viewer: { viewerSeatId: "opponent-seat" },
      }),
    ).toBe("public");
  });

  test("private zones show the card face only to the zone owner", () => {
    expect(
      resolveAnimationCardFaceForViewer({
        entity,
        zone: zone("private"),
        viewer: { viewerSeatId: "owner-seat" },
      }),
    ).toBe("public");
    expect(
      resolveAnimationCardFaceForViewer({
        entity,
        zone: zone("private"),
        viewer: { viewerSeatId: "opponent-seat" },
      }),
    ).toBe("hidden");
  });

  test("accepts a viewer seat id string for existing fixture callsites", () => {
    expect(
      resolveAnimationCardFaceForViewer({
        entity,
        zone: zone("private"),
        viewer: "owner-seat",
      }),
    ).toBe("public");
  });

  test("owner visibility follows the same viewer rule as private zones", () => {
    expect(
      resolveAnimationCardFaceForViewer({
        entity,
        zone: zone("owner"),
        viewer: { viewerSeatId: "owner-seat" },
      }),
    ).toBe("public");
    expect(
      resolveAnimationCardFaceForViewer({
        entity,
        zone: zone("owner"),
        viewer: { viewerSeatId: null },
      }),
    ).toBe("hidden");
  });

  test("secret zones hide cards unless an explicit reveal grants access", () => {
    expect(
      resolveAnimationCardFaceForViewer({
        entity,
        zone: zone("secret"),
        viewer: { viewerSeatId: "owner-seat" },
      }),
    ).toBe("hidden");
    expect(
      resolveAnimationCardFaceForViewer({
        entity,
        zone: zone("secret"),
        viewer: { viewerSeatId: "opponent-seat", revealedEntityIds: [entity.id] },
      }),
    ).toBe("public");
  });
});

describe("hidden animation projections", () => {
  test("redacts private card information before rendering", () => {
    const hidden = redactEntityForHiddenZone(entity);

    expect(hidden.title).toBe("Hidden card");
    expect(hidden.subtitle).toBe("Private information");
    expect(hidden.kind).toBe("card");
    expect(hidden.face).toBe("hidden");
    expect(hidden.states).toEqual([]);
    expect(hidden.imageUrl).toBeUndefined();
    expect(hidden.stats).toEqual([]);
    expect(hidden.traits).toEqual([]);
    expect(hidden.frameStyle).toBeUndefined();
    expect(hidden.overlayBadges).toBeUndefined();
    expect(hidden.spawnAnimation).toBeUndefined();
  });

  test("projects entities through the viewer visibility resolver", () => {
    expect(
      projectEntityForZoneViewer(entity, zone("private"), { viewerSeatId: "owner-seat" }).title,
    ).toBe("Visible Name");
    expect(
      projectEntityForZoneViewer(entity, zone("private"), { viewerSeatId: "opponent-seat" }).title,
    ).toBe("Hidden card");
  });
});
