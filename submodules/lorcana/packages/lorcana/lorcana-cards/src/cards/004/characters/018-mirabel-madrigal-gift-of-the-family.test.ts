import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mirabelMadrigalGiftOfTheFamily } from "./018-mirabel-madrigal-gift-of-the-family";

const madrigalAlly = createMockCharacter({
  id: "madrigal-ally",
  name: "Madrigal Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Ally", "Madrigal"],
});

const madrigalAlly2 = createMockCharacter({
  id: "madrigal-ally-2",
  name: "Madrigal Ally 2",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 2,
  classifications: ["Dreamborn", "Hero", "Madrigal"],
});

const nonMadrigalCharacter = createMockCharacter({
  id: "non-madrigal",
  name: "Non-Madrigal Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

describe("Mirabel Madrigal - Gift of the Family", () => {
  const resolveMirabelQuestBags = (
    testEngine: ReturnType<typeof LorcanaMultiplayerTestEngine.createWithFixture>,
    supportTarget: typeof madrigalAlly | typeof madrigalAlly2 | typeof nonMadrigalCharacter,
  ) => {
    while (testEngine.asPlayerOne().getBagCount() > 0) {
      const [bag] = testEngine.asPlayerOne().getBagEffects();
      const abilityName = (bag?.payload as { abilityName?: string } | undefined)?.abilityName;
      if (abilityName === "Support") {
        const canChooseSupportTarget =
          testEngine.asPlayerOne().getCardZone(supportTarget) === "play" &&
          supportTarget !== mirabelMadrigalGiftOfTheFamily;

        expect(
          testEngine
            .asPlayerOne()
            .resolveBag(bag!.id, canChooseSupportTarget ? { targets: [supportTarget] } : {}),
        ).toBeSuccessfulCommand();
        continue;
      }

      expect(testEngine.asPlayerOne().resolveBag(bag!.id)).toBeSuccessfulCommand();
    }
  };

  describe("Support keyword", () => {
    it("should have Support", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mirabelMadrigalGiftOfTheFamily],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().getCard(mirabelMadrigalGiftOfTheFamily).hasSupport).toBe(
        true,
      );
    });
  });

  describe("SAVING THE MIRACLE - Whenever this character quests, your other Madrigal characters get +1 {L} this turn.", () => {
    it("should give +1 lore to your other Madrigal characters when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: mirabelMadrigalGiftOfTheFamily, isDrying: false },
          madrigalAlly,
          nonMadrigalCharacter,
        ],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().getCard(madrigalAlly).lore).toBe(madrigalAlly.lore);
      expect(testEngine.asPlayerOne().getCard(nonMadrigalCharacter).lore).toBe(
        nonMadrigalCharacter.lore,
      );

      // Quest with Mirabel
      expect(
        testEngine.asPlayerOne().quest(mirabelMadrigalGiftOfTheFamily),
      ).toBeSuccessfulCommand();

      resolveMirabelQuestBags(testEngine, nonMadrigalCharacter);

      // Madrigal ally should have +1 lore
      expect(testEngine.asPlayerOne().getCard(madrigalAlly).lore).toBe(madrigalAlly.lore + 1);

      // Non-Madrigal character should NOT have +1 lore
      expect(testEngine.asPlayerOne().getCard(nonMadrigalCharacter).lore).toBe(
        nonMadrigalCharacter.lore,
      );
    });

    it("should give +1 lore to multiple Madrigal characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: mirabelMadrigalGiftOfTheFamily, isDrying: false },
          madrigalAlly,
          madrigalAlly2,
        ],
        deck: 3,
      });

      // Quest with Mirabel
      expect(
        testEngine.asPlayerOne().quest(mirabelMadrigalGiftOfTheFamily),
      ).toBeSuccessfulCommand();

      resolveMirabelQuestBags(testEngine, madrigalAlly);

      // Both Madrigal allies should have +1 lore
      expect(testEngine.asPlayerOne().getCard(madrigalAlly).lore).toBe(madrigalAlly.lore + 1);
      expect(testEngine.asPlayerOne().getCard(madrigalAlly2).lore).toBe(madrigalAlly2.lore + 1);
    });

    it("should NOT give +1 lore to Mirabel herself", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: mirabelMadrigalGiftOfTheFamily, isDrying: false }],
        deck: 3,
      });

      // Quest with Mirabel
      expect(
        testEngine.asPlayerOne().quest(mirabelMadrigalGiftOfTheFamily),
      ).toBeSuccessfulCommand();

      resolveMirabelQuestBags(testEngine, mirabelMadrigalGiftOfTheFamily);

      // Mirabel should NOT have +1 lore (excludeSelf)
      expect(testEngine.asPlayerOne().getCard(mirabelMadrigalGiftOfTheFamily).lore).toBe(
        mirabelMadrigalGiftOfTheFamily.lore,
      );
    });

    it("lore bonus should expire at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: mirabelMadrigalGiftOfTheFamily, isDrying: false }, madrigalAlly],
        deck: 3,
      });

      // Quest with Mirabel
      expect(
        testEngine.asPlayerOne().quest(mirabelMadrigalGiftOfTheFamily),
      ).toBeSuccessfulCommand();

      resolveMirabelQuestBags(testEngine, madrigalAlly);

      // Madrigal ally should have +1 lore during this turn
      expect(testEngine.asPlayerOne().getCard(madrigalAlly).lore).toBe(madrigalAlly.lore + 1);

      // End turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Lore bonus should be gone
      expect(testEngine.asPlayerOne().getCard(madrigalAlly).lore).toBe(madrigalAlly.lore);
    });
  });
});
