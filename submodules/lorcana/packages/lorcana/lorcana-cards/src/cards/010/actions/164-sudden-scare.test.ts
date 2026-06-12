import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { mowgliManCub } from "../characters/019-mowgli-man-cub";
import { suddenScare } from "./164-sudden-scare";

describe("Sudden Scare", () => {
  it("puts the chosen opposing character and that player's top deck card into their inkwell facedown", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [suddenScare],
        inkwell: suddenScare.cost,
      },
      {
        play: [simbaProtectiveCub],
        deck: [mowgliManCub],
      },
    );
    const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", "p2");
    const mowgliId = testEngine.findCardInstanceId(mowgliManCub, "deck", "p2");

    const playResult = testEngine.asPlayerOne().playCard(suddenScare, {
      targets: [simbaId],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(simbaId)).toBe("inkwell");
    expect(testEngine.asPlayerTwo().getCardZone(mowgliId)).toBe("inkwell");
    expect(testEngine.asPlayerTwo().getCardsInZone("inkwell", "player_two").count).toBe(2);
  });
});
