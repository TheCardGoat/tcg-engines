import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend, moanaChosenByTheOcean, simbaProtectiveCub } from "../../001";
import { goofyKnightForADay } from "../../002";
import { i2iEnchanted } from "./234-i2i-enchanted";

describe("I2I Enchanted", () => {
  it("makes each player draw 2 cards and gain 2 lore on a normal cast", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [i2iEnchanted],
        inkwell: i2iEnchanted.cost,
        deck: [moanaChosenByTheOcean, simbaProtectiveCub],
      },
      {
        deck: [goofyKnightForADay, mickeyMouseTrueFriend],
      },
    );

    expect(testEngine.asPlayerOne().playCard(i2iEnchanted)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);
    expect(testEngine.asPlayerTwo().getZonesCardCount().hand).toBe(2);
    expect(testEngine.getLore("player_one")).toBe(2);
    expect(testEngine.getLore("player_two")).toBe(2);
  });
});
