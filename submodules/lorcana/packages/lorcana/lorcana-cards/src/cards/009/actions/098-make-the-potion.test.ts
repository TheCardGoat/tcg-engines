import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { shieldOfVirtue } from "../../001/items/135-shield-of-virtue";
import { makeThePotion } from "./098-make-the-potion";

describe("Make the Potion", () => {
  it("can banish a chosen item", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [makeThePotion],
        inkwell: makeThePotion.cost,
      },
      {
        play: [shieldOfVirtue],
      },
    );
    const shieldId = testEngine.findCardInstanceId(shieldOfVirtue, "play", "p2");

    expect(
      testEngine.asPlayerOne().playCard(makeThePotion, {
        choiceIndex: 0,
        targets: [shieldId],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(shieldId)).toBe("discard");
  });
});
