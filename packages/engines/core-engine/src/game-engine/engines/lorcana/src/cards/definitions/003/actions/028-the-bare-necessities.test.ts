import { describe, expect, it } from "bun:test";
import { hakunaMatata } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs/songs";
import { theBareNecessities } from "~/game-engine/engines/lorcana/src/cards/definitions/003/actions";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
