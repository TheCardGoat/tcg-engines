import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001";
import { simbaPlayfulPouncer } from "./023-simba-playful-pouncer";

describe("Simba - Playful Pouncer", () => {
  it("YOU DON'T STAND A CHANCE - triggers when played and creates bag for target selection", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [simbaPlayfulPouncer],
        inkwell: simbaPlayfulPouncer.cost,
      },
      {
        play: [simbaProtectiveCub],
      },
    );

    expect(testEngine.asPlayerOne().playCard(simbaPlayfulPouncer)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(simbaPlayfulPouncer)).toBe("play");

    // The when-played trigger creates a bag effect for target selection
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
  });

  it("applies -2 strength to chosen opposing character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [simbaPlayfulPouncer],
        inkwell: simbaPlayfulPouncer.cost,
      },
      {
        play: [simbaProtectiveCub],
      },
    );
    const targetId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", PLAYER_TWO);

    expect(testEngine.asPlayerOne().playCard(simbaPlayfulPouncer)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveOnlyBag({ targets: [targetId] }),
    ).toBeSuccessfulCommand();

    // simbaProtectiveCub has 2 strength, should be 0 after -2
    expect(testEngine.asPlayerTwo().getCardStrength(simbaProtectiveCub)).toBe(0);
  });

  it("-2 strength persists through opponent's turn and expires at start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        hand: [simbaPlayfulPouncer],
        inkwell: simbaPlayfulPouncer.cost,
      },
      {
        deck: 2,
        play: [simbaProtectiveCub],
      },
    );
    const targetId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", PLAYER_TWO);

    expect(testEngine.asPlayerOne().playCard(simbaPlayfulPouncer)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveOnlyBag({ targets: [targetId] }),
    ).toBeSuccessfulCommand();

    // Effect is active immediately
    expect(testEngine.asPlayerTwo().getCardStrength(simbaProtectiveCub)).toBe(0);

    // Player one passes turn — effect persists during opponent's turn
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardStrength(simbaProtectiveCub)).toBe(0);

    // Player two passes turn — back to player one's turn, effect expires
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardStrength(simbaProtectiveCub)).toBe(2);
  });

  it("debuffed character deals reduced damage when challenging", () => {
    // Scenario: debuff opponent's character to 0 strength, then that character
    // challenges one of our exerted characters -- it should deal 0 damage.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        hand: [simbaPlayfulPouncer],
        inkwell: simbaPlayfulPouncer.cost,
        // Mickey is exerted and can be challenged by opponent
        play: [{ card: mickeyMouseTrueFriend, exerted: true }],
      },
      {
        deck: 2,
        // simbaProtectiveCub: strength 2, willpower 3. After -2 str -> 0 str
        play: [simbaProtectiveCub],
      },
    );
    const targetId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", PLAYER_TWO);

    // Play Simba and debuff opponent's character
    expect(testEngine.asPlayerOne().playCard(simbaPlayfulPouncer)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveOnlyBag({ targets: [targetId] }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardStrength(simbaProtectiveCub)).toBe(0);

    // Pass to opponent's turn
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Opponent challenges Mickey with the debuffed character
    expect(
      testEngine.asPlayerTwo().challenge(simbaProtectiveCub, mickeyMouseTrueFriend),
    ).toBeSuccessfulCommand();

    // Mickey (willpower 3) should take 0 damage from the debuffed attacker (0 strength)
    expect(testEngine.asPlayerOne().getDamage(mickeyMouseTrueFriend)).toBe(0);
    expect(testEngine.asPlayerOne().getCardZone(mickeyMouseTrueFriend)).toBe("play");

    // Simba Protective Cub (willpower 3) takes 3 damage from Mickey (strength 3) and is banished
    expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("discard");
  });
});
