/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  sapphireCoil,
  steelCoil,
  tamatoaHappyAsAClam,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Tamatoa - Happy as a Clam", () => {
  it("COOLEST COLLECTION When you play this character, return up to 2 item cards from your discard to your hand.", async () => {
    const testEngine = new TestEngine({
      inkwell: tamatoaHappyAsAClam.cost,
      discard: [steelCoil, sapphireCoil],
      hand: [tamatoaHappyAsAClam],
    });

    await testEngine.playCard(tamatoaHappyAsAClam, {
      targets: [sapphireCoil, steelCoil],
    });

    expect(testEngine.getZonesCardCount("player_one")).toEqual(
      expect.objectContaining({
        hand: 2,
        discard: 0,
      }),
    );
  });

  it.skip("I'M BEAUTIFUL, BABY! Whenever this character quests, you may play an item for free.", async () => {
    const testEngine = new TestEngine({
      inkwell: tamatoaHappyAsAClam.cost,
      play: [tamatoaHappyAsAClam],
      hand: [tamatoaHappyAsAClam],
    });

    await testEngine.playCard(tamatoaHappyAsAClam);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
