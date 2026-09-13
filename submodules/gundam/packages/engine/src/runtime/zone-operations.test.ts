import { describe, expect, it } from "vite-plus/test";
import { createPlayerId } from "../types/branded.ts";
import type { ZoneRuntimeState } from "../types/zone-types.ts";
import { gundamZones } from "../gundam/zones.ts";
import { createMockUnit } from "../gundam/testing/card-mocks.ts";
import { createZoneOperations } from "./zone-operations.ts";

describe("zone operations definition overrides", () => {
  it("preserves an override within the battle area and clears it when the card leaves", () => {
    const playerOne = createPlayerId("player_one");
    const playerTwo = createPlayerId("player_two");
    const definitionOverride = createMockUnit({ name: "Temporary Unit Identity" });
    const zones: ZoneRuntimeState = {
      public: { zoneSummaries: {} },
      private: {
        zoneCards: { [`battleArea:${playerOne}`]: ["card_1"] },
        cardIndex: {
          card_1: {
            zoneKey: `battleArea:${playerOne}`,
            index: 0,
            ownerID: playerOne,
            controllerID: playerOne,
          },
        },
        cardMeta: { card_1: { definitionOverride } },
      },
      reveals: { active: {}, nextId: 1 },
    };
    const operations = createZoneOperations(zones, gundamZones, () => 0.5, 0);

    operations.moveCard("card_1", { zone: "battleArea", playerId: playerTwo });
    expect(zones.private.cardMeta.card_1?.definitionOverride).toBe(definitionOverride);

    operations.moveCard("card_1", { zone: "hand", playerId: playerOne });
    expect(zones.private.cardMeta.card_1?.definitionOverride).toBeUndefined();
  });
});
