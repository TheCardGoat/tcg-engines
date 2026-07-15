import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import {
  aladdinPrinceAli,
  arielOnHumanLegs,
  goofyMusketeer,
  healingGlow,
  maximusPalaceHorse,
  princePhillipDragonslayer,
  simbaProtectiveCub,
  tinkerBellPeterPansAlly,
} from "../../001";
import { secondStarToTheRightEnchanted } from "./210-second-star-to-the-right-enchanted";

describe("Second Star to the Right (Enchanted) — sing path", () => {
  it("creates a player-selection prompt when sung via Sing Together", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [secondStarToTheRightEnchanted],
        play: [
          { card: goofyMusketeer, isDrying: false },
          { card: maximusPalaceHorse, isDrying: false },
          { card: princePhillipDragonslayer, isDrying: false },
        ],
      },
      {
        deck: [
          aladdinPrinceAli,
          arielOnHumanLegs,
          healingGlow,
          simbaProtectiveCub,
          tinkerBellPeterPansAlly,
        ],
      },
    );

    expect(
      testEngine
        .asPlayerOne()
        .playSongTogether(secondStarToTheRightEnchanted, [
          goofyMusketeer,
          maximusPalaceHorse,
          princePhillipDragonslayer,
        ]),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);
    const [pendingEffect] = testEngine.asPlayerOne().getPendingEffects();
    expect(pendingEffect?.selectionContext).toMatchObject({
      kind: "target-selection",
      playerCandidateIds: expect.arrayContaining([PLAYER_ONE, PLAYER_TWO]),
    });
  });
});
