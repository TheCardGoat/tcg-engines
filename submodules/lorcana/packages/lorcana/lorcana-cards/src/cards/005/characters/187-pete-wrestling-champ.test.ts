import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { peteBadGuy } from "../../002/characters/088-pete-bad-guy";
import { peterPanFearlessFighter } from "../../001/characters/119-peter-pan-fearless-fighter";
import { peteWrestlingChamp } from "./187-pete-wrestling-champ";

describe("Pete - Wrestling Champ", () => {
  describe("RE-PETE {E} - Reveal the top card of your deck. If it's a character card named Pete, you may play it for free.", () => {
    it("plays Pete for free when Pete is on top of the deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [peteWrestlingChamp],
        deck: [peteBadGuy],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(peteWrestlingChamp, {
          ability: "RE-PETE",
        }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(peteWrestlingChamp)).toBe(true);
      expect(testEngine.asPlayerOne().getCardZone(peteBadGuy)).toBe("play");
    });

    it("does not play when a non-Pete character is on top", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [peteWrestlingChamp],
        deck: [peterPanFearlessFighter],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(peteWrestlingChamp, {
          ability: "RE-PETE",
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(peteWrestlingChamp)).toBe(true);
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
      expect(testEngine.asPlayerOne().getCardZone(peterPanFearlessFighter)).toBe("deck");
    });
  });
});
