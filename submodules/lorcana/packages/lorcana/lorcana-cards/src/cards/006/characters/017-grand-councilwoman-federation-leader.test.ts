import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { grandCouncilwomanFederationLeader } from "./017-grand-councilwoman-federation-leader";

const alienAlly = createMockCharacter({
  id: "grand-councilwoman-alien-ally",
  name: "Alien Ally",
  cost: 2,
  lore: 1,
  classifications: ["Storyborn", "Alien"],
});

const nonAlienAlly = createMockCharacter({
  id: "grand-councilwoman-non-alien-ally",
  name: "Non-Alien Ally",
  cost: 2,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

describe("Grand Councilwoman - Federation Leader", () => {
  describe("FIND IT! - Whenever this character quests, your other Alien characters get +1 lore this turn.", () => {
    it("gives your other Alien characters +1 lore for the turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: grandCouncilwomanFederationLeader, isDrying: false },
          { card: alienAlly, isDrying: false },
          { card: nonAlienAlly, isDrying: false },
        ],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardLore(grandCouncilwomanFederationLeader)).toBe(
        grandCouncilwomanFederationLeader.lore,
      );
      expect(testEngine.asPlayerOne().getCardLore(alienAlly)).toBe(alienAlly.lore);
      expect(testEngine.asPlayerOne().getCardLore(nonAlienAlly)).toBe(nonAlienAlly.lore);

      expect(
        testEngine.asPlayerOne().quest(grandCouncilwomanFederationLeader),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(grandCouncilwomanFederationLeader)).toBe(
        grandCouncilwomanFederationLeader.lore,
      );
      expect(testEngine.asPlayerOne().getCardLore(alienAlly)).toBe(alienAlly.lore + 1);
      expect(testEngine.asPlayerOne().getCardLore(nonAlienAlly)).toBe(nonAlienAlly.lore);

      expect(testEngine.asPlayerOne().quest(alienAlly)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(
        grandCouncilwomanFederationLeader.lore + alienAlly.lore + 1,
      );
    });

    it("removes the lore bonus at the end of the turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: grandCouncilwomanFederationLeader, isDrying: false },
            { card: alienAlly, isDrying: false },
          ],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().quest(grandCouncilwomanFederationLeader),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardLore(alienAlly)).toBe(alienAlly.lore + 1);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(alienAlly)).toBe(alienAlly.lore);
    });
  });
});
