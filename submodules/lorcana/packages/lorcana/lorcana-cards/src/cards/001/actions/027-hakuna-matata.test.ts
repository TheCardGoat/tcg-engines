import { describe, expect, it } from "bun:test";
import { hakunaMatata } from "./027-hakuna-matata";
import { arielOnHumanLegs, moanaOfMotunui, pumbaaFriendlyWarthog } from "../characters";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";

describe("Hakuna Matata", () => {
  it("removes up to 3 damage from each of your characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [hakunaMatata],
        inkwell: hakunaMatata.cost,
        play: [moanaOfMotunui, pumbaaFriendlyWarthog],
      },
      {
        play: [arielOnHumanLegs],
      },
    );

    testEngine.asServer().manualSetDamage(moanaOfMotunui, 5);
    testEngine.asServer().manualSetDamage(pumbaaFriendlyWarthog, 2);
    testEngine.asServer().manualSetDamage(arielOnHumanLegs, 3);

    expect(testEngine.asPlayerOne().getDamage(moanaOfMotunui)).toEqual(5);
    expect(testEngine.asPlayerOne().getDamage(pumbaaFriendlyWarthog)).toEqual(2);
    expect(testEngine.asPlayerOne().getDamage(arielOnHumanLegs)).toEqual(3);

    testEngine.asPlayerOne().playCard(hakunaMatata);

    expect(testEngine.asPlayerOne().getDamage(moanaOfMotunui)).toEqual(2);
    expect(testEngine.asPlayerOne().getDamage(pumbaaFriendlyWarthog)).toEqual(0);
    expect(testEngine.asPlayerOne().getDamage(arielOnHumanLegs)).toEqual(3);
  });

  it("may remove 0 damage from each of your characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [hakunaMatata],
        inkwell: hakunaMatata.cost,
        play: [moanaOfMotunui],
      },
      {
        play: [arielOnHumanLegs],
      },
    );

    testEngine.asServer().manualSetDamage(moanaOfMotunui, 2);
    testEngine.asServer().manualSetDamage(arielOnHumanLegs, 2);

    expect(testEngine.asPlayerOne().getDamage(moanaOfMotunui)).toEqual(2);
    expect(testEngine.asPlayerOne().getDamage(arielOnHumanLegs)).toEqual(2);

    testEngine.asPlayerOne().playCard(hakunaMatata, {
      amount: 0,
    });

    expect(testEngine.asPlayerOne().getDamage(moanaOfMotunui)).toEqual(2);
    expect(testEngine.asPlayerOne().getDamage(arielOnHumanLegs)).toEqual(2);
  });
});
