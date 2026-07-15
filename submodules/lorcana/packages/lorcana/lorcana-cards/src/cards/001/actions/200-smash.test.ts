import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs, jetsamUrsulasSpy } from "../characters";
import { smash } from "./200-smash";

const wardedCharacter = createMockCharacter({
  id: "smash-warded-character",
  name: "Warded Character",
  cost: 2,
  strength: 2,
  willpower: 4,
  abilities: [{ id: "smash-ward", type: "keyword", keyword: "Ward", text: "Ward" }],
});

describe("Smash", () => {
  it("deals 3 damage to a chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [smash],
        inkwell: smash.cost,
      },
      {
        play: [arielOnHumanLegs],
      },
    );

    testEngine.asPlayerOne().playCard(smash, {
      targets: [arielOnHumanLegs],
    });

    expect(testEngine.asPlayerOne().getDamage(arielOnHumanLegs)).toEqual(3);
  });

  it("banishes an opposing character when damage is lethal", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [smash],
        inkwell: smash.cost,
      },
      {
        play: [jetsamUrsulasSpy],
      },
    );

    testEngine.asPlayerOne().playCard(smash, {
      targets: [jetsamUrsulasSpy],
    });

    expect(testEngine.asPlayerOne().getCardZone(jetsamUrsulasSpy)).toEqual("discard");
  });

  it("resolves successfully when the only opposing character has Ward", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [smash],
        inkwell: smash.cost,
      },
      {
        play: [wardedCharacter],
      },
    );

    expect(testEngine.asPlayerOne().playCard(smash)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(testEngine.asPlayerTwo().getDamage(wardedCharacter)).toEqual(0);
    expect(testEngine.asPlayerTwo().getCardZone(wardedCharacter)).toEqual("play");
  });
});
