import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockAction } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs, simbaProtectiveCub } from "../../001";
import { sisuEmboldenedWarrior } from "../characters/124-sisu-emboldened-warrior";
import { brawl } from "./130-brawl";

const handFiller = createMockAction({
  id: "brawl-derived-strength-hand-filler",
  name: "Hand Filler",
  cost: 1,
});

describe("Brawl", () => {
  it("banishes a chosen character with 2 strength or less", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [brawl],
        inkwell: brawl.cost,
      },
      {
        play: [simbaProtectiveCub],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(brawl, {
        targets: [simbaProtectiveCub],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("discard");
  });

  it("does not allow targeting a character with more than 2 strength", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [brawl],
        inkwell: brawl.cost,
      },
      {
        play: [arielOnHumanLegs],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(brawl, {
        targets: [arielOnHumanLegs],
      }).success,
    ).toBe(false);
    expect(testEngine.asPlayerTwo().getCardZone(arielOnHumanLegs)).toBe("play");
  });

  it("uses derived strength when checking Sisu - Emboldened Warrior as a target", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [brawl, handFiller],
        inkwell: brawl.cost,
      },
      {
        play: [sisuEmboldenedWarrior],
      },
    );

    expect(testEngine.asPlayerOne().playCard(brawl)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(brawl, {
        targets: [sisuEmboldenedWarrior],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(sisuEmboldenedWarrior)).toBe("discard");
  });
});
