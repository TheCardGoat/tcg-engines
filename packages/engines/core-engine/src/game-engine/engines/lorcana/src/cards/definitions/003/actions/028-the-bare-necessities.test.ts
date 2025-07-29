/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { hakunaMatata } from "@lorcanito/lorcana-engine/cards/001/songs/songs.ts";
import { theBareNecessities } from "@lorcanito/lorcana-engine/cards/003/actions/actions.ts";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine.ts";

describe("The Bare Necessities", () => {
  it("Chosen opponent reveals their hand and discards a non-character card of your choice.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: theBareNecessities.cost,
        hand: [theBareNecessities],
      },
      {
        hand: [hakunaMatata],
      },
    );

    await testEngine.playCard(theBareNecessities, { targets: [hakunaMatata] });

    expect(testEngine.getCardModel(hakunaMatata).zone).toEqual("discard");
  });
});
