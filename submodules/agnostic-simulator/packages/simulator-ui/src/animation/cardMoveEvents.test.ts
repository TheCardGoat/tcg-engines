import { describe, expect, test } from "bun:test";
import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";

import { cardMoveRecordsToSimulatorEvents } from "./cardMoveEvents.js";

const entity: SimulatorEntity = {
  id: "card-1",
  title: "Test Card",
  subtitle: "unit",
  kind: "unit",
  ownerId: "p1",
  face: "public",
  states: [],
  stats: [],
  traits: [],
};

function zoneDescriptor(zoneId: string, ownerId: string): SimulatorZone {
  return {
    id: `${zoneId}:${ownerId}`,
    label: zoneId,
    role: zoneId === "deck" ? "deck" : zoneId === "hand" ? "hand" : "battlefield",
    ownerId,
    visibility: zoneId === "deck" ? "secret" : zoneId === "hand" ? "private" : "public",
    entityIds: [],
    hint: zoneId,
  };
}

describe("cardMoveRecordsToSimulatorEvents", () => {
  test("projects deck-to-hand records as draw events", () => {
    const events = cardMoveRecordsToSimulatorEvents(
      [
        {
          id: "draw-1",
          cardId: "card-1",
          ownerId: "p1",
          fromZoneId: "deck",
          toZoneId: "hand",
        },
      ],
      {
        viewerSeatId: "p1",
        resolveEntity: () => entity,
        zoneDescriptor,
      },
    );

    const event = events[0];
    expect(event?.id).toBe("draw-1");
    expect(event?.primitive).toBe("draw");
    if (event?.primitive !== "draw") {
      throw new Error("Expected draw event");
    }
    expect(event.fromZone.id).toBe("deck:p1");
    expect(event.toZone.id).toBe("hand:p1");
  });

  test("projects other zone changes as zone transfers", () => {
    const events = cardMoveRecordsToSimulatorEvents(
      [
        {
          id: "play-1",
          cardId: "card-1",
          ownerId: "p1",
          fromZoneId: "hand",
          toZoneId: "battleArea",
        },
      ],
      {
        viewerSeatId: "p1",
        resolveEntity: () => entity,
        zoneDescriptor,
      },
    );

    expect(events[0]?.primitive).toBe("zoneTransfer");
  });
});
