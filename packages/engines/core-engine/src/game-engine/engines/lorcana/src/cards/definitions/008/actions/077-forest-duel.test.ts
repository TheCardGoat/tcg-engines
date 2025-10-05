import { describe, expect, it } from "bun:test";
import { goofyKnightForADay } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import {
  deweyLovableShowoff,
  forestDuel,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Forest Duel", () => {
  it('Your characters gain Challenger +2 and "When this character is banished in a challenge, return this card to your hand" this turn. (They get +2 {S} while challenging.)', async () => {
    const testEngine = new TestEngine(
      {
        inkwell: forestDuel.cost,
        play: [deweyLovableShowoff],
        hand: [forestDuel],
      },
      {
        play: [goofyKnightForADay],
      },
    );

    await testEngine.playCard(forestDuel);

    expect(testEngine.getCardModel(deweyLovableShowoff).hasChallenger).toEqual(
      true,
    );

    // TODO: Test challenge-triggered return to hand when triggered ability system is implemented
    // await testEngine.challenge({
    //   attacker: deweyLovableShowoff,
    //   defender: goofyKnightForADay,
    //   exertDefender: true,
    // });
    // expect(testEngine.getCardModel(deweyLovableShowoff).zone).toEqual("hand");
  });
});
