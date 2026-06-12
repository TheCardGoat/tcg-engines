import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mickeyMouseBraveLittlePrince } from "./111-mickey-mouse-brave-little-prince";

const mickeyTrueFriend = createMockCharacter({
  id: "mickey-true-friend-009",
  name: "Mickey Mouse",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkType: ["ruby"],
});

describe("Mickey Mouse - Brave Little Prince", () => {
  describe("CROWNING ACHIEVEMENT", () => {
    it("gets +3 strength, +3 willpower, and +3 lore when shifted (card under)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: mickeyMouseBraveLittlePrince, cardsUnder: [mickeyTrueFriend] }],
      });

      const card = testEngine.asPlayerOne().getCard(mickeyMouseBraveLittlePrince);

      expect(card.strength).toBe(mickeyMouseBraveLittlePrince.strength + 3);
      expect(card.willpower).toBe(mickeyMouseBraveLittlePrince.willpower + 3);
      expect(card.lore).toBe(mickeyMouseBraveLittlePrince.lore + 3);
    });

    it("has no stat increases without a card under him", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mickeyMouseBraveLittlePrince],
      });

      const card = testEngine.asPlayerOne().getCard(mickeyMouseBraveLittlePrince);

      expect(card.strength).toBe(mickeyMouseBraveLittlePrince.strength);
      expect(card.willpower).toBe(mickeyMouseBraveLittlePrince.willpower);
      expect(card.lore).toBe(mickeyMouseBraveLittlePrince.lore);
    });
  });
});
