import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { healingGlow, simbaProtectiveCub, stitchNewDog } from "../../001";
import { chernabogEvildoer } from "./003-chernabog-evildoer";

describe("Chernabog - Evildoer", () => {
  it("reduces his play cost by the number of character cards in your discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [chernabogEvildoer],
      discard: [simbaProtectiveCub, stitchNewDog, healingGlow],
      inkwell: 8,
      deck: 1,
    });

    expect(testEngine.asPlayerOne().getCard(chernabogEvildoer).playCost).toBe(8);
    expect(testEngine.asPlayerOne().playCard(chernabogEvildoer)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(chernabogEvildoer)).toBe("play");
  });

  it("shuffles all character cards from your discard into your deck when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [chernabogEvildoer],
      discard: [simbaProtectiveCub, stitchNewDog, healingGlow],
      inkwell: 8,
      deck: 1,
    });
    const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "discard", PLAYER_ONE);
    const stitchId = testEngine.findCardInstanceId(stitchNewDog, "discard", PLAYER_ONE);
    const healingGlowId = testEngine.findCardInstanceId(healingGlow, "discard", PLAYER_ONE);

    expect(testEngine.asPlayerOne().playCard(chernabogEvildoer)).toBeSuccessfulCommand();
    expect(testEngine.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(
      expect.arrayContaining([simbaId, stitchId]),
    );
    expect(testEngine.asPlayerOne().getCardZone(healingGlow)).toBe("discard");
    expect(testEngine.getCardInstanceIdsInZone("discard", PLAYER_ONE)).toEqual([healingGlowId]);
  });
});
