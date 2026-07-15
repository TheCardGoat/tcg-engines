import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs } from "../../001";
import { tianasPalaceJazzRestaurant } from "../locations";
import { olympusWouldBeThatWay } from "./197-olympus-would-be-that-way";

describe("Olympus Would Be That Way", () => {
  it("gives your characters +3 strength while they challenge a location this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [olympusWouldBeThatWay],
        inkwell: olympusWouldBeThatWay.cost,
        play: [arielOnHumanLegs],
      },
      {
        play: [tianasPalaceJazzRestaurant],
      },
    );

    expect(testEngine.asPlayerOne().playCard(olympusWouldBeThatWay)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().challenge(arielOnHumanLegs, tianasPalaceJazzRestaurant),
    ).toBeSuccessfulCommand();

    expect(testEngine.asServer().getDamage(tianasPalaceJazzRestaurant)).toBe(
      arielOnHumanLegs.strength + 3,
    );
  });
});
