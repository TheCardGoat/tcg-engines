/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { lawrenceJealousManservant } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Lawrence- Jealous Manservant", () => {
  describe("**PAYBACK** While this character has no damage, he gets +4 {S}.", () => {
    it("has no damage", () => {
      const testStore = new TestStore({
        inkwell: lawrenceJealousManservant.cost,
        play: [lawrenceJealousManservant],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        lawrenceJealousManservant.id,
      );

      expect(cardUnderTest.strength).toEqual(
        lawrenceJealousManservant.strength + 4,
      );
    });

    it("damaged", () => {
      const testStore = new TestStore({
        inkwell: lawrenceJealousManservant.cost,
        play: [lawrenceJealousManservant],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        lawrenceJealousManservant.id,
      );

      cardUnderTest.updateCardMeta({ damage: 1 });

      expect(cardUnderTest.strength).toEqual(0);
    });
  });
});

[
  {
    source: "s2",
    effects: {
      type: "attribute",
      attribute: "strength",
      amount: 4,
      modifier: "add",
      duration: "static",
      target: {
        type: "card",
        value: "all",
        filters: [{ filter: "instanceId", value: "s2" }],
      },
    },
    responder: "player_one",
  },
];
