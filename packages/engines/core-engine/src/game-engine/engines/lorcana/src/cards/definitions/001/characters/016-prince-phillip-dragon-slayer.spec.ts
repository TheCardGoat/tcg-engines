/**
 * @jest-environment node
 */

import { expect, it } from "@jest/globals";
import {
  mauiDemiGod,
  princePhillipDragonSlayer,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

export const princePhillipTestCase = async () => {
  const testStore = new TestEngine(
    {
      play: [princePhillipDragonSlayer],
    },
    {
      play: [mauiDemiGod],
    },
  );

  await testStore.challenge({
    attacker: princePhillipDragonSlayer,
    defender: mauiDemiGod,
    exertDefender: true,
  });

  expect(testStore.getCardModel(princePhillipDragonSlayer).zone).toEqual(
    "discard",
  );
  expect(testStore.getCardModel(mauiDemiGod).zone).toEqual("discard");
};

it("Prince Phillip Dragon Slayer", async () => {
  await princePhillipTestCase();
});
