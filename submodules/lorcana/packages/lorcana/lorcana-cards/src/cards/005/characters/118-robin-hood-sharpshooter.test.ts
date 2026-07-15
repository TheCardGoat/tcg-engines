import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { robinHoodSharpshooter } from "./118-robin-hood-sharpshooter";
import {
  aladdinPrinceAli,
  healingGlow,
  mickeyMouseTrueFriend,
  simbaProtectiveCub,
  tinkerBellPeterPansAlly,
} from "../../001";
import { visionOfTheFuture } from "../actions/160-vision-of-the-future";

const actionCardCostFive = createMockSong({
  id: "robin-action-5",
  name: "Cheap Action",
  cost: 5,
  text: "A test action card.",
  abilities: [],
});

const deckFillerA = createMockCharacter({ id: "robin-filler-a", name: "Filler A", cost: 1 });
const deckFillerB = createMockCharacter({ id: "robin-filler-b", name: "Filler B", cost: 2 });
const deckFillerC = createMockCharacter({ id: "robin-filler-c", name: "Filler C", cost: 3 });

describe("Robin Hood - Sharpshooter", () => {
  describe("MY GREATEST PERFORMANCE - Whenever this character quests, look at the top 4 cards of your deck. You may reveal an action card with cost 6 or less and play it for free. Put the rest in your discard.", () => {
    it("triggers a scry bag when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        deck: [actionCardCostFive, deckFillerA, deckFillerB, deckFillerC],
        play: [{ card: robinHoodSharpshooter, isDrying: false }],
      });

      expect(testEngine.asPlayerOne().quest(robinHoodSharpshooter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("plays an action card for free when selected for play destination, ending in discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        deck: [actionCardCostFive, deckFillerA, deckFillerB, deckFillerC],
        play: [{ card: robinHoodSharpshooter, isDrying: false }],
      });

      expect(testEngine.asPlayerOne().quest(robinHoodSharpshooter)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(robinHoodSharpshooter),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [
            { zone: "play", cards: [actionCardCostFive] },
            { zone: "discard", cards: [deckFillerA, deckFillerB, deckFillerC] },
          ],
        }),
      ).toBeSuccessfulCommand();

      // Action card must be played (effects executed) and finalized to discard, not stuck in play
      expect(testEngine.asPlayerOne().getCardZone(actionCardCostFive)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(deckFillerA)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(deckFillerB)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(deckFillerC)).toBe("discard");
    });

    it("resolves the played action's own effect when Vision of the Future is played for free", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        deck: [
          aladdinPrinceAli,
          healingGlow,
          mickeyMouseTrueFriend,
          simbaProtectiveCub,
          tinkerBellPeterPansAlly,
          visionOfTheFuture,
          deckFillerA,
          deckFillerB,
          deckFillerC,
        ],
        play: [{ card: robinHoodSharpshooter, isDrying: false }],
      });

      expect(testEngine.asPlayerOne().quest(robinHoodSharpshooter)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(robinHoodSharpshooter),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [
            { zone: "play", cards: [visionOfTheFuture] },
            { zone: "discard", cards: [deckFillerA, deckFillerB, deckFillerC] },
          ],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [
            { zone: "hand", cards: [mickeyMouseTrueFriend] },
            {
              zone: "deck-bottom",
              cards: [simbaProtectiveCub, aladdinPrinceAli, tinkerBellPeterPansAlly, healingGlow],
            },
          ],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(mickeyMouseTrueFriend)).toBe("hand");
    });

    it("discards all 4 cards when choosing not to play an action", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        deck: [actionCardCostFive, deckFillerA, deckFillerB, deckFillerC],
        play: [{ card: robinHoodSharpshooter, isDrying: false }],
      });

      expect(testEngine.asPlayerOne().quest(robinHoodSharpshooter)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(robinHoodSharpshooter),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [
            { zone: "play", cards: [] },
            { zone: "discard", cards: [actionCardCostFive, deckFillerA, deckFillerB, deckFillerC] },
          ],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(actionCardCostFive)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(deckFillerA)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(deckFillerB)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(deckFillerC)).toBe("discard");
    });
  });
});
