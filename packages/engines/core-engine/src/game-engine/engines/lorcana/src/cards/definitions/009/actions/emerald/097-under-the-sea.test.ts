/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { underTheSea } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";

describe("Under The Sea", () => {
  it.skip("Sing Together 8 (Any number of your or your teammates’ characters with total cost 8 or more may {E} to sing this song for free.)", async () => {
    const testEngine = new TestEngine({
      inkwell: underTheSea.cost,
      play: [underTheSea],
      hand: [underTheSea],
    });

    await testEngine.playCard(underTheSea);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("Put all opposing characters with 2 {S} or less on the bottom of their players’ decks in any order.", async () => {
    const testEngine = new TestEngine({
      inkwell: underTheSea.cost,
      play: [underTheSea],
      hand: [underTheSea],
    });

    await testEngine.playCard(underTheSea);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
