import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { withAFewGoodFriends } from "./065-with-a-few-good-friends";

const friendsSingerA = createMockCharacter({
  id: "with-a-few-good-friends-singer-a",
  name: "Friends Singer A",
  cost: 3,
});

const friendsSingerB = createMockCharacter({
  id: "with-a-few-good-friends-singer-b",
  name: "Friends Singer B",
  cost: 3,
});

const amberFriend = createMockCharacter({
  id: "with-a-few-good-friends-amber",
  name: "Amber Friend",
  cost: 2,
  inkType: ["amber"],
});

const rubySteelFriend = createMockCharacter({
  id: "with-a-few-good-friends-ruby-steel",
  name: "Ruby Steel Friend",
  cost: 2,
  inkType: ["ruby", "steel"],
});

const drawOne = createMockCharacter({
  id: "with-a-few-good-friends-draw-one",
  name: "Draw One",
  cost: 1,
});

const drawTwo = createMockCharacter({
  id: "with-a-few-good-friends-draw-two",
  name: "Draw Two",
  cost: 1,
});

const drawThree = createMockCharacter({
  id: "with-a-few-good-friends-draw-three",
  name: "Draw Three",
  cost: 1,
});

describe("With a Few Good Friends", () => {
  it("can be played via Sing Together 6", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [withAFewGoodFriends],
      play: [friendsSingerA, friendsSingerB],
    });

    expect(
      testEngine
        .asPlayerOne()
        .playSongTogether(withAFewGoodFriends, [friendsSingerA, friendsSingerB]),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(friendsSingerA)).toBe(true);
    expect(testEngine.asPlayerOne().isExerted(friendsSingerB)).toBe(true);
  });

  it("has the chosen player draw for each different ink type among your characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [withAFewGoodFriends],
        inkwell: withAFewGoodFriends.cost,
        play: [amberFriend, rubySteelFriend],
      },
      {
        deck: [drawOne, drawTwo, drawThree],
      },
    );

    expect(
      testEngine.asPlayerOne().playCardForPlayer(withAFewGoodFriends, PLAYER_TWO),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getZonesCardCount().hand).toBe(3);
  });
});
