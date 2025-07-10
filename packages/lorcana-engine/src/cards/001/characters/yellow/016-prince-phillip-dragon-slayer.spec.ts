/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  mauiDemiGod,
  princePhillipDragonSlayer,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
