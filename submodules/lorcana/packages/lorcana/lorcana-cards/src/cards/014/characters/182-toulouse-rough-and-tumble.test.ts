import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockSong,
  createMockAction,
  createMockCharacter,
  createMockItem,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { toulouseRoughAndTumble } from "./182-toulouse-rough-and-tumble";

const opposingSong = createMockSong({
  id: "toulouse-opposing-song",
  name: "Opposing Song",
  cost: 2,
  text: "A test song.",
});

describe("Toulouse - Rough and Tumble", () => {
  it("opponents can't play actions on their next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [toulouseRoughAndTumble],
        inkwell: toulouseRoughAndTumble.cost,
        deck: 1,
      },
      {
        hand: [opposingSong],
        inkwell: opposingSong.cost,
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().playCard(toulouseRoughAndTumble)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().playCard(opposingSong)).not.toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(opposingSong)).toBe("hand");
  });

  it("the restriction ends once your next turn starts", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [toulouseRoughAndTumble],
        inkwell: toulouseRoughAndTumble.cost,
        deck: 5,
      },
      {
        hand: [opposingSong],
        inkwell: opposingSong.cost,
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().playCard(toulouseRoughAndTumble)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    // Player One's next turn has started — the restriction expired.
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().playCard(opposingSong)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(opposingSong)).toBe("discard");
  });
  it("blocks paid actions and singing without spending ink or exerting the singer", () => {
    const action = createMockAction({ id: "toulouse-action", name: "Action", cost: 1 });
    const singer = createMockCharacter({ id: "toulouse-singer", name: "Singer", cost: 2 });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [toulouseRoughAndTumble], inkwell: 2, deck: 3 },
      {
        hand: [action, opposingSong],
        play: [{ card: singer, isDrying: false }],
        inkwell: 3,
        deck: 3,
      },
    );
    expect(game.asPlayerOne().playCard(toulouseRoughAndTumble)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(action)).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().singSong(opposingSong, singer)).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().isExerted(singer)).toBe(false);
    expect(game.asServer().getAvailableInk("player_two")).toBe(3);
    expect(game.asPlayerTwo().getCardZone(action)).toBe("hand");
    expect(game.asPlayerTwo().getCardZone(opposingSong)).toBe("hand");
  });

  it("does not restrict its controller or opposing non-action cards", () => {
    const action = createMockAction({ id: "toulouse-own-action", name: "Own Action", cost: 1 });
    const character = createMockCharacter({ id: "toulouse-character", name: "Character", cost: 1 });
    const item = createMockItem({ id: "toulouse-item", name: "Item", cost: 1 });
    const location = createMockLocation({ id: "toulouse-location", name: "Location", cost: 1 });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [toulouseRoughAndTumble, action], inkwell: 3, deck: 3 },
      { hand: [character, item, location], inkwell: 3, deck: 3 },
    );
    expect(game.asPlayerOne().playCard(toulouseRoughAndTumble)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().playCard(action)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(character)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(item)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(location)).toBeSuccessfulCommand();
  });
  it("keeps the restriction after Toulouse leaves play until the next controller turn", () => {
    const removal = createMockAction({
      id: "toulouse-removal",
      name: "Removal",
      cost: 1,
      abilities: [
        {
          type: "action",
          effect: {
            type: "banish",
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
        },
      ],
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [toulouseRoughAndTumble, removal], inkwell: 3, deck: 4 },
      { hand: [opposingSong], inkwell: 2, deck: 4 },
    );
    expect(game.asPlayerOne().playCard(toulouseRoughAndTumble)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().playCard(removal, { targets: [toulouseRoughAndTumble] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(toulouseRoughAndTumble)).toBe("discard");
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(opposingSong)).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(opposingSong)).toBeSuccessfulCommand();
  });

  it("player two restricts player one until player two's next turn", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [opposingSong], inkwell: 2, deck: 4 },
      { hand: [toulouseRoughAndTumble], inkwell: 2, deck: 4 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(toulouseRoughAndTumble)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().playCard(opposingSong)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().playCard(opposingSong)).toBeSuccessfulCommand();
  });

  it("two entries expire together and questing does not renew the restriction", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [toulouseRoughAndTumble, toulouseRoughAndTumble], inkwell: 4, deck: 4 },
      { hand: [opposingSong], inkwell: 2, deck: 4 },
    );
    const [first, second] = game.getCardInstanceIdsInZone("hand", "player_one");
    expect(game.asPlayerOne().playCard(first!)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().playCard(second!)).toBeSuccessfulCommand();
    expect(game.asServer().getAvailableInk("player_one")).toBe(0);
    expect(game.asPlayerOne().quest(first!)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(opposingSong)).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().quest(first!)).toBeSuccessfulCommand();
    expect(game.getLore("player_one")).toBe(1);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(opposingSong)).toBeSuccessfulCommand();
  });

  it("rejects unpaid play and inking does not create a restriction", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [toulouseRoughAndTumble], deck: 3 },
      { hand: [opposingSong], inkwell: 2, deck: 3 },
    );
    expect(game.asPlayerOne().playCard(toulouseRoughAndTumble)).not.toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().putIntoInkwell("player_one", toulouseRoughAndTumble),
    ).toBeSuccessfulCommand();
    expect(game.asServer().getAvailableInk("player_one")).toBe(1);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(opposingSong)).toBeSuccessfulCommand();
  });
});
