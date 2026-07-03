import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { mingLeeOverprotectiveParent } from "./049-ming-lee-overprotective-parent";

const shiftedMing = createMockCharacter({
  id: "ming-overprotective-shifted",
  name: "Ming Lee",
  cost: 6,
  abilities: [
    {
      id: "ming-overprotective-shifted-shift",
      type: "keyword",
      keyword: "Shift",
      text: "Shift 1",
      cost: { ink: 1 },
    },
  ],
});

const opposingExertedCharacter = createMockCharacter({
  id: "ming-overprotective-opposing-exerted",
  name: "Opposing Exerted Character",
  cost: 2,
  willpower: 3,
});

describe("Ming Lee - Overprotective Parent", () => {
  it("prevents a chosen opposing exerted character from readying after you shift on top of her", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [mingLeeOverprotectiveParent],
        hand: [shiftedMing],
        inkwell: 1,
        deck: 3,
      },
      {
        play: [{ card: opposingExertedCharacter, exerted: true }],
        deck: 3,
      },
    );
    const shiftTarget = testEngine.findCardInstanceId(
      mingLeeOverprotectiveParent,
      "play",
      PLAYER_ONE,
    );

    expect(
      testEngine.asPlayerOne().playCard(shiftedMing, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(mingLeeOverprotectiveParent, {
        targets: [opposingExertedCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.hasRestriction(opposingExertedCharacter, "cant-ready")).toBe(true);
  });
});
