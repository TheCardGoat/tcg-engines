import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { sheriffOfNottinghamCorruptOfficial } from "./191-sheriff-of-nottingham-corrupt-official";
import { suddenChill } from "../../001/actions/098-sudden-chill";

const opposingCharacter = createMockCharacter({
  id: "sheriff-co-opposing-char",
  name: "Opposing Character",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
});

const discardFodder = createMockCharacter({
  id: "sheriff-co-discard-fodder",
  name: "Discard Fodder",
  cost: 1,
});

describe("Sheriff of Nottingham - Corrupt Official", () => {
  describe("TAXES SHOULD HURT - Whenever you discard a card, you may deal 1 damage to chosen opposing character.", () => {
    it("deals 1 damage to a chosen opposing character when the controller discards via Sudden Chill", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [suddenChill],
          inkwell: suddenChill.cost,
          play: [opposingCharacter],
        },
        {
          play: [sheriffOfNottinghamCorruptOfficial],
          hand: [discardFodder],
        },
      );

      expect(testEngine.asPlayerOne().playCard(suddenChill)).toBeSuccessfulCommand();

      const discardFodderId = testEngine.findCardInstanceId(discardFodder, "hand", "player_two");
      expect(
        testEngine.asPlayerTwo().resolveNextPending({
          targets: [discardFodderId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(discardFodder)).toBe("discard");
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerTwo().getBagEffects();
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(sheriffOfNottinghamCorruptOfficial),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().resolveNextPending({
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(opposingCharacter)).toBe(1);
    });

    it("can decline the optional damage ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [suddenChill],
          inkwell: suddenChill.cost,
          play: [opposingCharacter],
        },
        {
          play: [sheriffOfNottinghamCorruptOfficial],
          hand: [discardFodder],
        },
      );

      expect(testEngine.asPlayerOne().playCard(suddenChill)).toBeSuccessfulCommand();

      const discardFodderId = testEngine.findCardInstanceId(discardFodder, "hand", "player_two");
      expect(
        testEngine.asPlayerTwo().resolveNextPending({
          targets: [discardFodderId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(discardFodder)).toBe("discard");
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerTwo().getBagEffects();
      expect(
        testEngine
          .asPlayerTwo()
          .resolvePendingByCard(sheriffOfNottinghamCorruptOfficial, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(opposingCharacter)).toBe(0);
    });
  });
});
