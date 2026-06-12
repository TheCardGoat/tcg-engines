import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { shieldOfVirtue } from "../../001/items/135-shield-of-virtue";
import { makeThePotion } from "./094-make-the-potion";

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

    const playResult = testEngine.asPlayerOne().playCard(makeThePotion, {
      choiceIndex: 0,
      targets: [shieldId],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(shieldId)).toBe("discard");
  });

  it("can deal 2 damage to a chosen damaged character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [makeThePotion],
        inkwell: makeThePotion.cost,
      },
      {
        play: [simbaProtectiveCub],
      },
    );
    testEngine.asServer().manualSetDamage(simbaProtectiveCub, 1);
    const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", "p2");

    const playResult = testEngine.asPlayerOne().playCard(makeThePotion, {
      choiceIndex: 1,
      targets: [simbaId],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(simbaId)).toBe("discard");
  });
});
