/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { gazelleAngelWithHorns } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Gazelle - Angel with Horns", () => {
  it.skip("YOU ARE A REALLY HOT DANCER When you play this character, chosen character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)", async () => {
    const testEngine = new TestEngine({
      inkwell: gazelleAngelWithHorns.cost,
      hand: [gazelleAngelWithHorns],
    });

    await testEngine.playCard(gazelleAngelWithHorns);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
