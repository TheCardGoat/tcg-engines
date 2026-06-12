import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import {
  aladdinPrinceAli,
  arielOnHumanLegs,
  healingGlow,
  simbaProtectiveCub,
  tinkerBellPeterPansAlly,
} from "../../001";
import { goofyKnightForADay } from "../../002";
import { friendLikeMe } from "./160-friend-like-me";

describe("Friend Like Me", () => {
  it("puts the top 3 cards of each player's deck into their inkwell exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [friendLikeMe],
        inkwell: friendLikeMe.cost,
        deck: [aladdinPrinceAli, arielOnHumanLegs, healingGlow],
      },
      {
        deck: [simbaProtectiveCub, tinkerBellPeterPansAlly, goofyKnightForADay],
      },
    );

    expect(testEngine.asPlayerOne().playCard(friendLikeMe)).toBeSuccessfulCommand();

    expect(testEngine.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(
      friendLikeMe.cost + 3,
    );
    expect(testEngine.getCardInstanceIdsInZone("inkwell", PLAYER_TWO)).toHaveLength(3);
    expect(testEngine.asPlayerOne().getCardZone(aladdinPrinceAli)).toBe("inkwell");
    expect(testEngine.asPlayerOne().getCardZone(arielOnHumanLegs)).toBe("inkwell");
    expect(testEngine.asPlayerOne().getCardZone(healingGlow)).toBe("inkwell");
    expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("inkwell");
    expect(testEngine.asPlayerTwo().getCardZone(tinkerBellPeterPansAlly)).toBe("inkwell");
    expect(testEngine.asPlayerTwo().getCardZone(goofyKnightForADay)).toBe("inkwell");
    expect(testEngine.isExerted(aladdinPrinceAli)).toBe(true);
    expect(testEngine.asPlayerTwo().isExerted(simbaProtectiveCub)).toBe(true);
  });
});
