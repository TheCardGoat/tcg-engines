import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mickeyMouseBraveLittlePrinceIconic } from "./242-mickey-mouse-brave-little-prince-iconic";

const mickeyTrueFriend = createMockCharacter({
  id: "mickey-true-friend-iconic",
  name: "Mickey Mouse",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkType: ["ruby"],
});

describe("Mickey Mouse - Brave Little Prince (Iconic)", () => {
  describe("CROWNING ACHIEVEMENT", () => {
    it("gets +3 strength, +3 willpower, and +3 lore when shifted (card under)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: mickeyMouseBraveLittlePrinceIconic, cardsUnder: [mickeyTrueFriend] }],
      });

      const card = testEngine.asPlayerOne().getCard(mickeyMouseBraveLittlePrinceIconic);

      expect(card.strength).toBe(mickeyMouseBraveLittlePrinceIconic.strength + 3);
      expect(card.willpower).toBe(mickeyMouseBraveLittlePrinceIconic.willpower + 3);
      expect(card.lore).toBe(mickeyMouseBraveLittlePrinceIconic.lore + 3);
    });

    it("has no stat increases without a card under him", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mickeyMouseBraveLittlePrinceIconic],
      });

      const card = testEngine.asPlayerOne().getCard(mickeyMouseBraveLittlePrinceIconic);

      expect(card.strength).toBe(mickeyMouseBraveLittlePrinceIconic.strength);
      expect(card.willpower).toBe(mickeyMouseBraveLittlePrinceIconic.willpower);
      expect(card.lore).toBe(mickeyMouseBraveLittlePrinceIconic.lore);
    });
  });
});
