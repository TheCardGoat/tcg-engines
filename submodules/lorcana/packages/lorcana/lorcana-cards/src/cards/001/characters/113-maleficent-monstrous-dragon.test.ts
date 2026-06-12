import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { maleficentMonstrousDragon } from "./113-maleficent-monstrous-dragon";

const targetCharacter = createMockCharacter({
  id: "maleficent-target",
  name: "Target Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Maleficent - Monstrous Dragon", () => {
  describe("DRAGON FIRE - When you play this character, you may banish chosen character.", () => {
    it("banishes chosen character when ability is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: maleficentMonstrousDragon.cost,
          hand: [maleficentMonstrousDragon],
        },
        {
          play: [targetCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(maleficentMonstrousDragon)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(maleficentMonstrousDragon),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [targetCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(targetCharacter)).toBe("discard");
    });

    it("ability is optional - can decline to banish", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: maleficentMonstrousDragon.cost,
          hand: [maleficentMonstrousDragon],
        },
        {
          play: [targetCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(maleficentMonstrousDragon)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(maleficentMonstrousDragon, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(targetCharacter)).toBe("play");
    });

    it("can target own character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: maleficentMonstrousDragon.cost,
          hand: [maleficentMonstrousDragon],
          play: [targetCharacter],
        },
        {},
      );

      expect(testEngine.asPlayerOne().playCard(maleficentMonstrousDragon)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(maleficentMonstrousDragon),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [targetCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(targetCharacter)).toBe("discard");
    });
  });
});
