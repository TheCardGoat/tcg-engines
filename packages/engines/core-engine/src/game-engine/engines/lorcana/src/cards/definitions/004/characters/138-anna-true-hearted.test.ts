/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { mrSmeeBumblingMate } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import { annaTrueHearted } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import { minnieMouseQuickthinkingInventor } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Anna - True-Hearted", () => {
  it("**LET ME HELP YOU** Whenever this character quests, your other Hero characters get +1 {L} this turn.", () => {
    const testStore = new TestStore({
      play: [
        annaTrueHearted,
        minnieMouseQuickthinkingInventor,
        mrSmeeBumblingMate,
      ],
    });

    // Fetch the cards in play
    const cardUnderTest = testStore.getByZoneAndId("play", annaTrueHearted.id);
    const target1 = testStore.getByZoneAndId(
      "play",
      minnieMouseQuickthinkingInventor.id,
    );
    const target2 = testStore.getByZoneAndId("play", mrSmeeBumblingMate.id);

    // Quest with Anna
    cardUnderTest.quest();

    // Check if the other Hero characters have +1 lore and non-hero characters are unchanged
    expect(target1.lore).toEqual(2);
    expect(target2.lore).toEqual(2);

    // Quest with the other heroes
    target1.quest();
    target2.quest();

    // Check to see if the lore total has increased by the expected amount
    expect(testStore.getPlayerLore()).toEqual(6);

    // Pass the turn
    const response = testStore.passTurn();
    expect(response.success).toBeTruthy();

    // Check to see if the lore of the other Hero characters has decreased by the expected amount
    expect(target1.lore).toEqual(1);
    expect(target2.lore).toEqual(2);
  });
});
