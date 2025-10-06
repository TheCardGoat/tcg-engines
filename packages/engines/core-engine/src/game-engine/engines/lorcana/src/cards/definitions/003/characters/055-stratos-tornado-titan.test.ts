/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { stratosTornadoTitan } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Stratos - Tornado Titan", () => {
  it.skip("**Evasive** _(Only characters with Evasive can challenge this character.)_**CYCLONE** {E} – Gain lore equal to the number of Titan characters you have in play.", () => {
    const testStore = new TestStore({
      play: [stratosTornadoTitan],
    });

    const cardUnderTest = testStore.getCard(stratosTornadoTitan);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
