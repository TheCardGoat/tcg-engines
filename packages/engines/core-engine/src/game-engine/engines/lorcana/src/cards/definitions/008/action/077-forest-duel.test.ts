/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import {
  deweyLovableShowoff,
  forestDuel,
} from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Forest Duel", () => {
  it("Your characters gain Challenger +2 and “When this character is banished in a challenge, return this card to your hand” this turn. (They get +2 {S} while challenging.)", async () => {
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

    await testEngine.challenge({
      attacker: deweyLovableShowoff,
      defender: goofyKnightForADay,
      exertDefender: true,
    });

    expect(testEngine.getCardModel(deweyLovableShowoff).zone).toEqual("hand");
  });
});
