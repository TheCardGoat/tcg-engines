import { describe, expect, it } from "bun:test";
import { PLAYER_ONE, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  aladdinPrinceAli,
  healingGlow,
  mickeyMouseTrueFriend,
  simbaProtectiveCub,
  tinkerBellPeterPansAlly,
} from "../../001";
import { visionOfTheFuture } from "./160-vision-of-the-future";

describe("Vision of the Future", () => {
  it("puts one looked-at card into your hand and the rest on the bottom in the chosen order", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [visionOfTheFuture],
      inkwell: visionOfTheFuture.cost,
      deck: [
        aladdinPrinceAli,
        healingGlow,
        mickeyMouseTrueFriend,
        simbaProtectiveCub,
        tinkerBellPeterPansAlly,
      ],
    });

    expect(
      testEngine.asPlayerOne().playCardWithDestinations(
        visionOfTheFuture,
        {
          zone: "hand",
          cards: [mickeyMouseTrueFriend],
        },
        {
          zone: "deck-bottom",
          cards: [simbaProtectiveCub, aladdinPrinceAli, tinkerBellPeterPansAlly, healingGlow],
        },
      ),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(mickeyMouseTrueFriend)).toBe("hand");
    expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([
      healingGlow.id,
      tinkerBellPeterPansAlly.id,
      aladdinPrinceAli.id,
      simbaProtectiveCub.id,
    ]);
  });
});
