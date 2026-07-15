import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { mauriceUnconventionalInventor } from "./138-maurice-unconventional-inventor";
import { mauricesMachine } from "../items/151-maurices-machine";

const otherItem = createMockItem({
  id: "maurice-other-item",
  name: "Other Item",
  cost: 1,
});

describe("Maurice - Unconventional Inventor", () => {
  describe("HOW ON EARTH DID THAT HAPPEN? - When you play this character, you may banish chosen item of yours to draw a card. If the banished item is named Maurice's Machine, you may also banish chosen character with 2 {S} or less.", () => {
    it("triggers when played and creates a bag effect", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [mauriceUnconventionalInventor],
          inkwell: mauriceUnconventionalInventor.cost,
          play: [mauricesMachine],
        },
        {},
      );

      expect(
        testEngine.asPlayerOne().playCard(mauriceUnconventionalInventor),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    });

    it("banishes an item and draws a card when optional is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [mauriceUnconventionalInventor],
          inkwell: mauriceUnconventionalInventor.cost,
          play: [mauricesMachine],
          deck: 5,
        },
        {},
      );

      const handCountBefore = testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length;

      expect(
        testEngine.asPlayerOne().playCard(mauriceUnconventionalInventor),
      ).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(mauriceUnconventionalInventor, {
          resolveOptional: true,
          targets: [mauricesMachine],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(mauricesMachine)).toBe("discard");
      expect(testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length).toBe(handCountBefore);
    });

    it("banishes a non-Maurice's Machine item and draws a card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [mauriceUnconventionalInventor],
          inkwell: mauriceUnconventionalInventor.cost,
          play: [otherItem],
          deck: 5,
        },
        {},
      );

      const handCountBefore = testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length;

      expect(
        testEngine.asPlayerOne().playCard(mauriceUnconventionalInventor),
      ).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(mauriceUnconventionalInventor, {
          resolveOptional: true,
          targets: [otherItem],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(otherItem)).toBe("discard");
      expect(testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length).toBe(handCountBefore);
    });

    it("declining the optional banish does not banish item or draw a card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [mauriceUnconventionalInventor],
          inkwell: mauriceUnconventionalInventor.cost,
          play: [mauricesMachine],
          deck: 5,
        },
        {},
      );

      const handCountBefore = testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length;

      expect(
        testEngine.asPlayerOne().playCard(mauriceUnconventionalInventor),
      ).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(mauriceUnconventionalInventor, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(mauricesMachine)).toBe("play");
      expect(testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length).toBe(
        handCountBefore - 1,
      );
    });

    it.todo("if the banished item is named Maurice's Machine, may also banish chosen character with 2 strength or less - needs engine support for checking banished card name", () => {});
  });
});
