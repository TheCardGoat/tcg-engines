import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { peteSteamboatRival } from "./116-pete-steamboat-rival";
import { peteWrestlingChamp } from "./187-pete-wrestling-champ";

const opponentCharacter = createMockCharacter({
  id: "pete-test-opponent-char",
  name: "Opponent Character",
  cost: 1,
  strength: 2,
  willpower: 5,
  lore: 1,
});

const nonPeteCharacter = createMockCharacter({
  id: "pete-test-non-pete",
  name: "Not Pete",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Pete - Steamboat Rival", () => {
  describe("SCRAM! - When you play this character, if you have another character named Pete in play, you may banish chosen opposing character.", () => {
    it("banishes chosen opposing character when another Pete is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [peteSteamboatRival],
          play: [peteWrestlingChamp],
          inkwell: peteSteamboatRival.cost,
          deck: 1,
        },
        {
          play: [opponentCharacter],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(peteSteamboatRival)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(peteSteamboatRival, {
          resolveOptional: true,
          targets: [opponentCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getCard(opponentCharacter)).toBeInZone("discard");
    });

    it("does not trigger when no other Pete is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [peteSteamboatRival],
          play: [nonPeteCharacter],
          inkwell: peteSteamboatRival.cost,
          deck: 1,
        },
        {
          play: [opponentCharacter],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(peteSteamboatRival)).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.getCard(opponentCharacter)).toBeInZone("play");
    });
  });
});
