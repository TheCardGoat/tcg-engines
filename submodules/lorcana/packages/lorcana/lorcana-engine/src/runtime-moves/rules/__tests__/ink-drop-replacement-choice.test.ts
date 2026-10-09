// CR 7.7: an optional replacement changes the incoming event before it occurs.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
  createMockCharacter,
} from "../../../testing";

const replacementSource = createMockCharacter({
  id: "ink-drop-replacement-source",
  name: "Replacement Source",
  cost: 1,
  abilities: [
    {
      type: "static",
      name: "Supercharge",
      text: "If you would get an ink drop, you may put the top card of your deck into your inkwell facedown and exerted instead.",
      effect: {
        type: "restriction",
        restriction: "would-gain-ink-drop-replacement",
        target: "SELF",
      },
    },
  ],
});
const sharedGain = createMockAction({
  id: "shared-ink-drop-gain",
  name: "Shared Gain",
  cost: 1,
  text: "Each player gets 2 ink drops.",
  abilities: [
    {
      type: "action",
      text: "Each player gets 2 ink drops.",
      effect: { type: "gain-ink-drop", amount: 2, target: "EACH_PLAYER" },
    },
  ],
});

describe("optional ink-drop replacement choices", () => {
  it("lets each affected player choose and does not repeat the choice for a declined drop", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [replacementSource],
        hand: [sharedGain],
        inkwell: 1,
        deck: 4,
      },
      { play: [replacementSource], deck: 4 },
    );
    expect(game.asPlayerOne().playCard(sharedGain)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().resolveNextPending({ choiceIndex: 0 })).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().resolveNextPending({ choiceIndex: 0 })).toBeSuccessfulCommand();
    expect(game.asPlayerOne().resolveNextPending({ choiceIndex: 1 })).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().resolveNextPending({ choiceIndex: 1 })).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().resolveNextPending({ choiceIndex: 0 })).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
    expect(game.asPlayerOne().getZonesCardCount().deck).toBe(3);
    expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(3);
    expect(game.asServer().getState().G.turnMetadata.inkDropsGainedThisTurn).toEqual({
      [PLAYER_ONE]: 1,
      [PLAYER_TWO]: 1,
    });
    game.dispose();
  });
});
