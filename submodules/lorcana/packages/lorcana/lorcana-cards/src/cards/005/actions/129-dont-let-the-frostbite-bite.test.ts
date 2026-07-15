import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub, tinkerBellPeterPansAlly } from "../../001";
import { dontLetTheFrostbiteBite } from "./129-dont-let-the-frostbite-bite";

describe("Don't Let the Frostbite Bite", () => {
  it("readies all your characters and prevents them from questing for the rest of the turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [dontLetTheFrostbiteBite],
      inkwell: dontLetTheFrostbiteBite.cost,
      play: [
        { card: simbaProtectiveCub, exerted: true },
        { card: tinkerBellPeterPansAlly, exerted: true },
      ],
    });

    expect(testEngine.asPlayerOne().playCard(dontLetTheFrostbiteBite)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toBeReady(simbaProtectiveCub);
    expect(testEngine.asPlayerOne()).toBeReady(tinkerBellPeterPansAlly);
    expect(testEngine.asPlayerOne()).toHaveRestriction({
      card: simbaProtectiveCub,
      restriction: "cant-quest",
    });
    expect(testEngine.asPlayerOne()).toHaveRestriction({
      card: tinkerBellPeterPansAlly,
      restriction: "cant-quest",
    });
  });
});
