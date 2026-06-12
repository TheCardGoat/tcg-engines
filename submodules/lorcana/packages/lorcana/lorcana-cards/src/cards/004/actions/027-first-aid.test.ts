import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs, moanaOfMotunui, pumbaaFriendlyWarthog } from "../../001";
import { firstAid } from "./027-first-aid";

describe("First Aid", () => {
  it("removes up to 1 damage from each of your characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [firstAid],
        inkwell: firstAid.cost,
        play: [moanaOfMotunui, pumbaaFriendlyWarthog],
      },
      {
        play: [arielOnHumanLegs],
      },
    );

    testEngine.asServer().manualSetDamage(moanaOfMotunui, 2);
    testEngine.asServer().manualSetDamage(pumbaaFriendlyWarthog, 1);
    testEngine.asServer().manualSetDamage(arielOnHumanLegs, 3);

    expect(testEngine.asPlayerOne().playCard(firstAid)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(moanaOfMotunui)).toBe(1);
    expect(testEngine.asPlayerOne().getDamage(pumbaaFriendlyWarthog)).toBe(0);
    expect(testEngine.asPlayerTwo().getDamage(arielOnHumanLegs)).toBe(3);
  });
});
