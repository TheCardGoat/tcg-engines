import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockAction,
} from "@tcg/lorcana-engine/testing";
import { cursedMerfolkUrsulasHandiwork } from "@tcg/lorcana-cards/cards/003";
import { mauiHalfshark } from "@tcg/lorcana-cards/cards/006";

const actionForCheehoooo = createMockAction({
  id: "the-910-action-in-discard",
  name: "THE-910 Test Action",
  cost: 2,
});

/**
 * THE-910: Maui CHEEEEOHOOOO! (return action from discard) and Cursed Merfolk POOR SOULS
 * (opponents discard) must both apply — opponent cannot "skip" Poor Souls by having an empty
 * hand when Poor Souls resolves if Maui's return will add a card first.
 */
describe("THE-910 — Maui Half-Shark vs Cursed Merfolk Poor Souls", () => {
  it("after CHEEEEOHOOOO returns an action, Maui's player discards a card for Poor Souls", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: mauiHalfshark, isDrying: false }],
        discard: [{ card: actionForCheehoooo }],
        deck: 5,
      },
      {
        play: [{ card: cursedMerfolkUrsulasHandiwork, exerted: true }],
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(0);

    expect(
      testEngine.asPlayerOne().challenge(mauiHalfshark, cursedMerfolkUrsulasHandiwork),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(mauiHalfshark, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    const actionInstanceId = testEngine.findCardInstanceId(actionForCheehoooo, "discard");
    if (testEngine.asPlayerOne().getPendingChoice()) {
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [actionInstanceId] }),
      ).toBeSuccessfulCommand();
    }

    expect(testEngine.asPlayerOne().getCardZone(actionForCheehoooo)).toBe("hand");

    const handCardId = testEngine.findCardInstanceId(actionForCheehoooo, "hand");

    expect(
      testEngine.asPlayerTwo().resolvePendingByCard(cursedMerfolkUrsulasHandiwork),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [handCardId] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(actionForCheehoooo)).toBe("discard");
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });
});
