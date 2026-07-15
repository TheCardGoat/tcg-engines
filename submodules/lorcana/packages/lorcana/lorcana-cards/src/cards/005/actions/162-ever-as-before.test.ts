import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001";
import { everAsBefore } from "./162-ever-as-before";

describe("Ever as Before", () => {
  it("removes up to 2 damage from each chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [everAsBefore],
        inkwell: everAsBefore.cost,
        play: [{ card: simbaProtectiveCub, damage: 3 }],
      },
      {
        play: [{ card: mickeyMouseTrueFriend, damage: 1 }],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(everAsBefore, {
        targets: [simbaProtectiveCub, mickeyMouseTrueFriend],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveDamage({ card: simbaProtectiveCub, value: 1 });
    expect(testEngine.asPlayerTwo()).toHaveDamage({ card: mickeyMouseTrueFriend, value: 0 });
  });
});
