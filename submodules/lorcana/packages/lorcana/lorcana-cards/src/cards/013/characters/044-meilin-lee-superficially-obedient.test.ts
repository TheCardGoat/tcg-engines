import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { meilinLeeSuperficiallyObedient } from "./044-meilin-lee-superficially-obedient";

const shiftedMeilin = createMockCharacter({
  id: "meilin-superficially-shifted",
  name: "Meilin Lee",
  cost: 3,
  abilities: [
    {
      id: "meilin-superficially-shifted-shift",
      type: "keyword",
      keyword: "Shift",
      text: "Shift 1",
      cost: { ink: 1 },
    },
  ],
});

describe("Meilin Lee - Superficially Obedient", () => {
  it("gives Evasive to the character shifted on top of her until the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [meilinLeeSuperficiallyObedient],
      hand: [shiftedMeilin],
      inkwell: 1,
      deck: 3,
    });
    const shiftTarget = testEngine.findCardInstanceId(
      meilinLeeSuperficiallyObedient,
      "play",
      PLAYER_ONE,
    );

    expect(
      testEngine.asPlayerOne().playCard(shiftedMeilin, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(shiftedMeilin, "Evasive")).toBe(true);
  });
});
