import { describe, expect, it } from "bun:test";
import { createCardId, createPlayerId, createZoneId } from "../types";
import { createZone } from "./zone-factory";
import { filterZoneByVisibility } from "./zone-visibility";

describe("Zone Visibility", () => {
  describe("filterZoneByVisibility", () => {
    it("should show all cards in public zone to all players", () => {
      const cards = [createCardId("card-1"), createCardId("card-2")];
      const zone = createZone(
        {
          id: createZoneId("play"),
          name: "Play Area",
          visibility: "public",
          ordered: false,
        },
        cards,
      );

      const viewerId = createPlayerId("player-1");
      const filtered = filterZoneByVisibility(zone, viewerId);

      expect(filtered.cards).toEqual(cards);
      expect(filtered.cards).toHaveLength(2);
    });

    it("should show cards in private zone to owner", () => {
      const ownerId = createPlayerId("player-1");
      const cards = [createCardId("card-1"), createCardId("card-2")];
      const zone = createZone(
        {
          id: createZoneId("hand"),
          name: "Hand",
          visibility: "private",
          ordered: false,
          owner: ownerId,
        },
        cards,
      );

      const filtered = filterZoneByVisibility(zone, ownerId);

      expect(filtered.cards).toEqual(cards);
    });

    it("should hide cards in private zone from non-owner", () => {
      const ownerId = createPlayerId("player-1");
      const viewerId = createPlayerId("player-2");
      const cards = [createCardId("card-1"), createCardId("card-2")];
      const zone = createZone(
        {
          id: createZoneId("hand"),
          name: "Hand",
          visibility: "private",
          ordered: false,
          owner: ownerId,
        },
        cards,
      );

      const filtered = filterZoneByVisibility(zone, viewerId);

      expect(filtered.cards).toHaveLength(0);
      expect(filtered.config).toEqual(zone.config);
    });

    it("should hide all cards in secret zone from all players", () => {
      const cards = [createCardId("card-1"), createCardId("card-2")];
      const zone = createZone(
        {
          id: createZoneId("deck"),
          name: "Deck",
          visibility: "secret",
          ordered: true,
          faceDown: true,
        },
        cards,
      );

      const viewerId = createPlayerId("player-1");
      const filtered = filterZoneByVisibility(zone, viewerId);

      expect(filtered.cards).toHaveLength(0);
    });

    it("should show card count but hide contents for private zone", () => {
      const ownerId = createPlayerId("player-1");
      const viewerId = createPlayerId("player-2");
      const cards = [
        createCardId("card-1"),
        createCardId("card-2"),
        createCardId("card-3"),
      ];
      const zone = createZone(
        {
          id: createZoneId("hand"),
          name: "Hand",
          visibility: "private",
          ordered: false,
          owner: ownerId,
        },
        cards,
      );

      const filtered = filterZoneByVisibility(zone, viewerId);

      // Config should be preserved so count can be determined
      expect(filtered.config).toEqual(zone.config);
      // But cards should be empty
      expect(filtered.cards).toHaveLength(0);
    });

    it("should show card count but hide contents for secret zone", () => {
      const cards = [
        createCardId("card-1"),
        createCardId("card-2"),
        createCardId("card-3"),
      ];
      const zone = createZone(
        {
          id: createZoneId("deck"),
          name: "Deck",
          visibility: "secret",
          ordered: true,
        },
        cards,
      );

      const viewerId = createPlayerId("player-1");
      const filtered = filterZoneByVisibility(zone, viewerId);

      // Config preserved
      expect(filtered.config).toEqual(zone.config);
      // Cards hidden
      expect(filtered.cards).toHaveLength(0);
    });

    it("should handle zone without owner as public", () => {
      const cards = [createCardId("card-1"), createCardId("card-2")];
      const zone = createZone(
        {
          id: createZoneId("graveyard"),
          name: "Graveyard",
          visibility: "public",
          ordered: true,
        },
        cards,
      );

      const viewerId = createPlayerId("player-1");
      const filtered = filterZoneByVisibility(zone, viewerId);

      expect(filtered.cards).toEqual(cards);
    });
  });
});
