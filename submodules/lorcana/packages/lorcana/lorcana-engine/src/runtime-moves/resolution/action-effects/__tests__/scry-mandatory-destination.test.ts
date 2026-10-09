import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
} from "../../../../testing";

const character = createMockCharacter({ id: "mandatory-character", cost: 1, name: "Character" });
const action = createMockAction({
  id: "bottom-action",
  cost: 1,
  name: "Action",
  text: "An action.",
});
const scout = createMockCharacter({
  id: "mandatory-scry-scout",
  cost: 1,
  name: "Scout",
  abilities: [
    {
      type: "activated",
      cost: { exert: true },
      effect: {
        type: "scry",
        amount: 2,
        revealAll: true,
        destinations: [
          {
            zone: "hand",
            remainder: true,
            max: 2,
            filters: [{ type: "card-type", cardType: "character" }],
          },
          { zone: "deck-bottom", remainder: true, ordering: "player-choice" },
        ],
      },
    },
  ],
});

describe("mandatory filtered scry destination", () => {
  it("rejects a later selection of an automatically assigned card without consuming the choice", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [scout],
      deck: [character, action],
    });
    expect(game.asPlayerOne().activateAbility(scout)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolveNextPending({
        destinations: [{ zone: "deck-bottom", cards: [character, action] }],
      }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(character)).toBe("deck");
    expect(
      game
        .asPlayerOne()
        .resolveNextPending({ destinations: [{ zone: "deck-bottom", cards: [action] }] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(character)).toBe("hand");
    expect(game.asPlayerOne().getCardZone(action)).toBe("deck");
  });
});
