import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend } from "../../001";
import { thisIsMyFamily } from "./081-this-is-my-family";

describe("This Is My Family", () => {
  it("gains 1 lore and draws a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [thisIsMyFamily],
      inkwell: thisIsMyFamily.cost,
      deck: [mickeyMouseTrueFriend],
    });

    expect(testEngine.asPlayerOne().playCard(thisIsMyFamily)).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
  });
});
