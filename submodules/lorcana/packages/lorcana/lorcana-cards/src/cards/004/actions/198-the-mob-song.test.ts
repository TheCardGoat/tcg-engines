import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub, tinkerBellPeterPansAlly } from "../../001";
import { duckburgFunsosFunzone } from "../../010/locations/034-duckburg-funsos-funzone";
import { theMobSong } from "./198-the-mob-song";

describe("The Mob Song", () => {
  it("deals 3 damage to up to 3 chosen characters and/or locations", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [theMobSong],
        inkwell: theMobSong.cost,
      },
      {
        play: [simbaProtectiveCub, tinkerBellPeterPansAlly, duckburgFunsosFunzone],
      },
    );

    const playResult = testEngine.asPlayerOne().playCard(theMobSong, {
      targets: [simbaProtectiveCub, tinkerBellPeterPansAlly, duckburgFunsosFunzone],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(tinkerBellPeterPansAlly)).toBe("discard");
    expect(testEngine.asPlayerTwo().getDamage(duckburgFunsosFunzone)).toBe(3);
  });
});
