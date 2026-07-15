import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs } from "../../001";
import {
  generalLiHeadOfTheImperialArmy,
  jumbaJookibaCriticalScientist,
  khanWarHorse,
} from "../characters";
import { lightTheFuse } from "./149-light-the-fuse";
import { goofyKnightForADay } from "../../002";

describe("Light The Fuse", () => {
  it("deal 1 damage to chosen character for each exerted character you have in play.", () => {
    const exertedChars = [
      khanWarHorse,
      generalLiHeadOfTheImperialArmy,
      jumbaJookibaCriticalScientist,
      arielOnHumanLegs,
    ];

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [lightTheFuse],
        inkwell: lightTheFuse.cost,
        play: exertedChars,
      },
      {
        play: [goofyKnightForADay],
      },
    );

    const playerOnePlayCardIds = testEngine.getCardInstanceIdsInZone("play", "player_one");
    for (const exertedCharId of playerOnePlayCardIds) {
      testEngine.asServer().manualExertCard(exertedCharId);
    }

    testEngine.asPlayerOne().playCard(lightTheFuse, {
      targets: [goofyKnightForADay],
    });

    expect(testEngine.asPlayerOne().getDamage(goofyKnightForADay)).toEqual(exertedChars.length);
  });
});
