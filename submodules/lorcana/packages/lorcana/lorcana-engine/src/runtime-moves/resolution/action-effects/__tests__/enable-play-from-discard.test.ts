import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
} from "../../../../testing";

const permission = createMockAction({
  id: "discard-permission",
  name: "Discard permission",
  cost: 1,
  abilities: [
    {
      type: "action",
      effect: {
        type: "enable-play-from-discard",
        cardType: "character",
        duration: "this-turn",
        scope: "all-cards",
        entersExerted: true,
        uniqueByName: true,
      },
    },
  ],
});
const friend = createMockCharacter({ id: "discard-friend", name: "Friend", cost: 1 });
const twin = createMockCharacter({ id: "hand-friend", name: "Friend", cost: 1 });

describe("enable-play-from-discard", () => {
  it("restricts matching names in hand as well as discard, only for its duration", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [permission, twin], discard: [friend], inkwell: 4, deck: 5 },
      { deck: 5 },
    );
    const player = game.asPlayerOne();
    expect(player.playCard(permission)).toBeSuccessfulCommand();
    expect(player.playCard(friend)).toBeSuccessfulCommand();
    expect(player.isExerted(friend)).toBe(true);
    expect(player.playCard(twin)).not.toBeSuccessfulCommand();
    expect(player.getCardZone(twin)).toBe("hand");
    expect(player.passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(player.playCard(twin)).toBeSuccessfulCommand();
    expect(player.isExerted(twin)).toBe(false);
  });
});
