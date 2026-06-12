import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { goofyKnightForADay } from "../../002";
import { simbaProtectiveCub } from "../../001";
import { herculesMightyLeader } from "../characters/118-hercules-mighty-leader";
import { heHurledHisThunderboltEpic } from "./222-he-hurled-his-thunderbolt-epic";

describe("He Hurled His Thunderbolt - Epic", () => {
  it("deals 4 damage and gives your Deity characters Challenger +2 this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [heHurledHisThunderboltEpic],
        inkwell: heHurledHisThunderboltEpic.cost,
        play: [herculesMightyLeader],
      },
      {
        play: [{ card: goofyKnightForADay, exerted: true }, simbaProtectiveCub],
      },
    );

    const playResult = testEngine.asPlayerOne().playCard(heHurledHisThunderboltEpic, {
      targets: [simbaProtectiveCub],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("discard");
    expect(testEngine.asPlayerOne()).toHaveKeyword({
      card: herculesMightyLeader,
      keyword: "Challenger",
      value: 2,
    });
  });
});
