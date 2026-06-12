import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "./020-simba-protective-cub";
import { elsaSnowQueen } from "./041-elsa-snow-queen";

describe("Elsa - Snow Queen", () => {
  it("exerts the chosen opposing character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        play: [{ card: elsaSnowQueen, isDrying: false }],
      },
      {
        deck: 2,
        play: [simbaProtectiveCub],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(elsaSnowQueen, {
        targets: [simbaProtectiveCub],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().isExerted(simbaProtectiveCub)).toBe(true);
  });
});
