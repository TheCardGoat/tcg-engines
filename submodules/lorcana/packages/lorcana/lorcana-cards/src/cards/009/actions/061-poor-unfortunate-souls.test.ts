import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { shieldOfVirtue } from "../../001/items/135-shield-of-virtue";
import { duckburgFunsosFunzone } from "../../010/locations/034-duckburg-funsos-funzone";
import { poorUnfortunateSouls } from "./061-poor-unfortunate-souls";

describe("Poor Unfortunate Souls", () => {
  it("returns a chosen character, item, or location with cost 2 or less to its player's hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [poorUnfortunateSouls],
        inkwell: poorUnfortunateSouls.cost,
      },
      {
        play: [shieldOfVirtue, duckburgFunsosFunzone],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(poorUnfortunateSouls, {
        targets: [duckburgFunsosFunzone],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(duckburgFunsosFunzone)).toBe("hand");
    expect(testEngine.asPlayerTwo().getCardZone(shieldOfVirtue)).toBe("play");
  });
});
