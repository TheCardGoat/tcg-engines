import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { atlanticaConcertHall } from "./034-atlantica-concert-hall";

const choirGuest = createMockCharacter({
  id: "set9-atlantica-choir-guest",
  name: "Choir Guest",
  cost: 2,
});

const deepBallad = createMockSong({
  id: "set9-atlantica-deep-ballad",
  name: "Deep Ballad",
  cost: 4,
  text: "Sing Together 4",
});

describe("Atlantica - Concert Hall", () => {
  it("increases the singer threshold for characters here by 2", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [deepBallad],
      play: [atlanticaConcertHall, choirGuest],
      inkwell: atlanticaConcertHall.moveCost,
    });

    expect(testEngine.asPlayerOne().singSong(deepBallad, choirGuest).success).toBe(false);
    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(choirGuest, atlanticaConcertHall).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().singSong(deepBallad, choirGuest)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(deepBallad)).toBe("discard");
  });
});
