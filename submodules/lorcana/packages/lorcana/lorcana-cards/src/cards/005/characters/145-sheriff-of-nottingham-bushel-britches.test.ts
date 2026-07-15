import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockItem } from "@tcg/lorcana-engine/testing";
import { sheriffOfNottinghamBushelBritches } from "./145-sheriff-of-nottingham-bushel-britches";

const itemOne = createMockItem({
  id: "sheriff-bb-item-one",
  name: "Item One",
  cost: 1,
});

const itemTwo = createMockItem({
  id: "sheriff-bb-item-two",
  name: "Item Two",
  cost: 1,
});

const itemThree = createMockItem({
  id: "sheriff-bb-item-three",
  name: "Item Three",
  cost: 1,
});

describe("Sheriff of Nottingham - Bushel Britches", () => {
  describe("EVERY LITTLE BIT HELPS - For each item you have in play, you pay 1 {I} less to play this character.", () => {
    it("costs 1 less to play for each item you control in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 7,
        play: [itemOne, itemTwo],
        hand: [sheriffOfNottinghamBushelBritches],
      });

      expect(
        testEngine.asPlayerOne().playCard(sheriffOfNottinghamBushelBritches),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(sheriffOfNottinghamBushelBritches)).toBe("play");
    });

    it("cannot be played without enough ink after discount", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 6,
        play: [itemOne, itemTwo],
        hand: [sheriffOfNottinghamBushelBritches],
      });

      expect(testEngine.asPlayerOne().playCard(sheriffOfNottinghamBushelBritches).success).toBe(
        false,
      );
    });

    it("gets no discount when you control no items", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 8,
        hand: [sheriffOfNottinghamBushelBritches],
      });

      expect(testEngine.asPlayerOne().playCard(sheriffOfNottinghamBushelBritches).success).toBe(
        false,
      );
    });
  });

  describe("Support", () => {
    it("has the Support keyword", () => {
      expect(
        sheriffOfNottinghamBushelBritches.abilities?.some(
          (a) => a.type === "keyword" && a.keyword === "Support",
        ),
      ).toBe(true);
    });
  });
});
