/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { madHattersTeapot } from "@lorcanito/lorcana-engine/cards/006/items/items";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Mad Hatter's Teapot", () => {
  it("**NO ROOM, NO ROOM**, {E}, 1 {I} – Each opponent puts the top card of their deck into their discard.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: 2,
        play: [madHattersTeapot],
        deck: 2,
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.getZonesCardCount("player_one")).toEqual(
      expect.objectContaining({ deck: 2 }),
    );
    expect(testEngine.getZonesCardCount("player_two")).toEqual(
      expect.objectContaining({ deck: 2 }),
    );

    await testEngine.activateCard(madHattersTeapot);

    expect(testEngine.getZonesCardCount("player_one")).toEqual(
      expect.objectContaining({ deck: 2 }),
    );
    expect(testEngine.getZonesCardCount("player_two")).toEqual(
      expect.objectContaining({ deck: 1 }),
    );
  });
});
