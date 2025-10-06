/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { motunuiIslandParadise } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";

describe("Motunui - Island Paradise", () => {
  it.skip("**REINCARNATION** Whenever a character is banished while here, you may put that card into your inkwell facedown and exerted.", async () => {
    const testEngine = new TestEngine({
      inkwell: motunuiIslandParadise.cost,
      play: [motunuiIslandParadise],
      hand: [motunuiIslandParadise],
    });

    await testEngine.playCard(motunuiIslandParadise);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
