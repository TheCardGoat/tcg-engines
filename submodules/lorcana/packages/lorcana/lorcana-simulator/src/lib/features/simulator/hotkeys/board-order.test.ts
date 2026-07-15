import { describe, expect, it } from "bun:test";
import type { LorcanaCardSnapshot } from "@/features/simulator/model/contracts.js";
import { buildOrderedPlayZoneEntries, getOrderedPlayZoneCards } from "./board-order.js";

function createCard(
  cardId: string,
  label: string,
  overrides: Partial<LorcanaCardSnapshot> = {},
): LorcanaCardSnapshot {
  return {
    cardId,
    definitionId: `def-${cardId}`,
    isMasked: false,
    label,
    ownerId: "player-one",
    ownerSide: "playerOne",
    zoneId: "play",
    facePresentation: "faceUp",
    ...overrides,
  };
}

describe("board-order", () => {
  it("keeps top seat location clusters inline", () => {
    const cards = [
      createCard("location-1", "Location", { cardType: "location" }),
      createCard("character-1", "Occupant", {
        cardType: "character",
        atLocationId: "location-1",
      }),
      createCard("character-2", "Standalone", { cardType: "character" }),
    ];

    const ordered = buildOrderedPlayZoneEntries(cards, "top");

    expect(ordered.map((entry) => entry.kind)).toEqual(["locationCluster", "card"]);
    expect(ordered[0]?.kind).toBe("locationCluster");
    if (ordered[0]?.kind === "locationCluster") {
      expect(ordered[0].location.cardId).toBe("location-1");
      expect(ordered[0].occupants.map((card) => card.cardId)).toEqual(["character-1"]);
    }
    expect(ordered[1]?.kind).toBe("card");
    if (ordered[1]?.kind === "card") {
      expect(ordered[1].card.cardId).toBe("character-2");
    }
  });

  it("moves bottom seat location clusters after standalone cards", () => {
    const cards = [
      createCard("location-1", "Location", { cardType: "location" }),
      createCard("character-1", "Occupant", {
        cardType: "character",
        atLocationId: "location-1",
      }),
      createCard("character-2", "Standalone", { cardType: "character" }),
    ];

    const ordered = getOrderedPlayZoneCards(cards, "bottom");

    expect(ordered.map((card) => card.cardId)).toEqual([
      "character-2",
      "location-1",
      "character-1",
    ]);
  });

  it("ignores occupants whose location is not visible", () => {
    const cards = [
      createCard("character-1", "Loose Character", {
        cardType: "character",
        atLocationId: "missing-location",
      }),
    ];

    const ordered = buildOrderedPlayZoneEntries(cards, "bottom");

    expect(ordered).toHaveLength(1);
    expect(ordered[0]?.kind).toBe("card");
    if (ordered[0]?.kind === "card") {
      expect(ordered[0].card.cardId).toBe("character-1");
    }
  });
});
