/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { jimHawkinsStubbornCabinBoy } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";

describe("Jim Hawkins - Stubborn Cabin Boy", () => {
  it.skip("COME HERE, COME HERE, COME HERE! During your turn, whenever a card is put into your inkwell, this character gets Challenger +2 this turn. (While challenging, this character gets +2 {S}.)", async () => {
    const testEngine = new TestEngine({
      inkwell: jimHawkinsStubbornCabinBoy.cost,
      play: [jimHawkinsStubbornCabinBoy],
      hand: [jimHawkinsStubbornCabinBoy],
    });

    await testEngine.playCard(jimHawkinsStubbornCabinBoy);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
