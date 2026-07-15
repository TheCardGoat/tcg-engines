import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import {
  aladdinPrinceAli,
  healingGlow,
  mickeyMouseTrueFriend,
  simbaProtectiveCub,
} from "../../001";
import { littleJohnImpermanentOutlaw } from "../characters";
import { recoveredPage } from "./030-recovered-page";

describe("Recovered Page", () => {
  describe("WHAT IS TO COME", () => {
    it("puts a chosen character from the top 4 cards into your hand and bottoms the rest in the chosen order", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [recoveredPage],
        inkwell: recoveredPage.cost,
        deck: [healingGlow, simbaProtectiveCub, aladdinPrinceAli, mickeyMouseTrueFriend],
      });

      expect(testEngine.asPlayerOne().playCard(recoveredPage)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(testEngine.asPlayerOne().resolvePendingByCard(recoveredPage)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [
            {
              zone: "hand",
              cards: [simbaProtectiveCub],
            },
            {
              zone: "deck-bottom",
              cards: [mickeyMouseTrueFriend, healingGlow, aladdinPrinceAli],
            },
          ],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("hand");
      expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([
        aladdinPrinceAli.id,
        healingGlow.id,
        mickeyMouseTrueFriend.id,
      ]);
    });
  });

  describe("WHISPERED POWER 1", () => {
    it("puts the top card of deck under a character with Boost when activated, banishing the item", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 1,
        deck: 3,
        play: [recoveredPage, littleJohnImpermanentOutlaw],
      });

      expect(testEngine.getCardsUnder(littleJohnImpermanentOutlaw)).toHaveLength(0);
      expect(testEngine.asPlayerOne().getCardZone(recoveredPage)).toBe("play");

      expect(
        testEngine.asPlayerOne().activateAbility(recoveredPage, { ability: "WHISPERED POWER" }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [littleJohnImpermanentOutlaw] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(recoveredPage)).toBe("discard");
      expect(testEngine.getCardsUnder(littleJohnImpermanentOutlaw)).toHaveLength(1);
    });
  });
});
