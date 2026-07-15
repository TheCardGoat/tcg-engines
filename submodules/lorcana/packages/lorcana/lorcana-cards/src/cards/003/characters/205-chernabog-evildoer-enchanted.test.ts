import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { healingGlow, simbaProtectiveCub, stitchNewDog } from "../../001";
import { chernabogEvildoerEnchanted } from "./205-chernabog-evildoer-enchanted";

describe("Chernabog - Evildoer Enchanted", () => {
  it("reduces his play cost by the number of character cards in your discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [chernabogEvildoerEnchanted],
      discard: [simbaProtectiveCub, stitchNewDog, healingGlow],
      inkwell: 8,
      deck: 1,
    });

    // healingGlow is an action, not a character, so only 2 characters in discard
    // cost 10 - 2 = 8
    expect(testEngine.asPlayerOne().getCard(chernabogEvildoerEnchanted).playCost).toBe(8);
    expect(testEngine.asPlayerOne().playCard(chernabogEvildoerEnchanted)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(chernabogEvildoerEnchanted)).toBe("play");
  });

  it("shuffles all character cards from your discard into your deck when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [chernabogEvildoerEnchanted],
      discard: [simbaProtectiveCub, stitchNewDog, healingGlow],
      inkwell: 8,
      deck: 1,
    });
    const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "discard", PLAYER_ONE);
    const stitchId = testEngine.findCardInstanceId(stitchNewDog, "discard", PLAYER_ONE);
    const healingGlowId = testEngine.findCardInstanceId(healingGlow, "discard", PLAYER_ONE);

    expect(testEngine.asPlayerOne().playCard(chernabogEvildoerEnchanted)).toBeSuccessfulCommand();
    // Character cards should be shuffled into deck
    expect(testEngine.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(
      expect.arrayContaining([simbaId, stitchId]),
    );
    // Non-character cards (healingGlow is an action) should remain in discard
    expect(testEngine.asPlayerOne().getCardZone(healingGlow)).toBe("discard");
    expect(testEngine.getCardInstanceIdsInZone("discard", PLAYER_ONE)).toEqual([healingGlowId]);
  });

  it("can be played at full cost with no characters in discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [chernabogEvildoerEnchanted],
      inkwell: 10,
      deck: 1,
    });

    expect(testEngine.asPlayerOne().getCard(chernabogEvildoerEnchanted).playCost).toBe(10);
    expect(testEngine.asPlayerOne().playCard(chernabogEvildoerEnchanted)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(chernabogEvildoerEnchanted)).toBe("play");
  });
});
