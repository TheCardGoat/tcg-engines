/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import {
  hadesInfernalSchemer,
  mauriceWorldFamousInventor,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Hades - Infernal Schemer", () => {
  it("**IS THERE A DOWNSIDE TO THIS?** When you play this character, you may put chosen opposing character into their player's inkwell facedown.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: hadesInfernalSchemer.cost,
        hand: [hadesInfernalSchemer],
      },
      {
        play: [mauriceWorldFamousInventor],
      },
    );

    await testEngine.playCard(hadesInfernalSchemer);
    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({
      targets: [mauriceWorldFamousInventor],
    });

    const target = testEngine.getCardModel(mauriceWorldFamousInventor);

    expect(target.zone).toEqual("inkwell");
    expect(target.ready).toEqual(false);
  });
});
