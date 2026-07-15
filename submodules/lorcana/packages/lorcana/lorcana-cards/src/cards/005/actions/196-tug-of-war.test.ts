import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseBraveLittleTailor } from "../../001";
import { mickeyMouseGiantMouse } from "../../008";
import { tugofwar } from "./196-tug-of-war";

describe("Tug-of-War", () => {
  it("deals 1 damage to each opposing character without Evasive in the first mode", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [tugofwar],
        inkwell: tugofwar.cost,
      },
      {
        play: [mickeyMouseBraveLittleTailor, mickeyMouseGiantMouse],
      },
    );

    expect(testEngine.asPlayerOne().playCardWithChoice(tugofwar, 0)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo()).toHaveDamage({
      card: mickeyMouseBraveLittleTailor,
      value: 0,
    });
    expect(testEngine.asPlayerTwo()).toHaveDamage({
      card: mickeyMouseGiantMouse,
      value: 1,
    });
  });

  it("deals 3 damage to each opposing character with Evasive in the second mode", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [tugofwar],
        inkwell: tugofwar.cost,
      },
      {
        play: [mickeyMouseBraveLittleTailor, mickeyMouseGiantMouse],
      },
    );

    expect(testEngine.asPlayerOne().playCardWithChoice(tugofwar, 1)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo()).toHaveDamage({
      card: mickeyMouseBraveLittleTailor,
      value: 3,
    });
    expect(testEngine.asPlayerTwo()).toHaveDamage({
      card: mickeyMouseGiantMouse,
      value: 0,
    });
  });
});
