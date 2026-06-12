import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { timothyQMouseFlightInstructor } from "./047-timothy-q-mouse-flight-instructor";
import { ryderFleetfootedInfiltrator } from "../../008/characters/056-ryder-fleet-footed-infiltrator";

const nonEvasiveCharacter = createMockCharacter({
  id: "timothy-009-test-non-evasive",
  name: "Non-Evasive Character",
  cost: 1,
});

describe("Timothy Q. Mouse - Flight Instructor", () => {
  it("LET'S SHOW 'EM, DUMBO! - base lore when no evasive character in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [timothyQMouseFlightInstructor, nonEvasiveCharacter],
    });

    expect(testEngine.asPlayerOne().getCardLore(timothyQMouseFlightInstructor)).toBe(
      timothyQMouseFlightInstructor.lore,
    );
  });

  it("LET'S SHOW 'EM, DUMBO! - gets +1 lore while you have a character with Evasive in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [timothyQMouseFlightInstructor, ryderFleetfootedInfiltrator],
    });

    expect(testEngine.asPlayerOne().getCardLore(timothyQMouseFlightInstructor)).toBe(
      timothyQMouseFlightInstructor.lore + 1,
    );
  });
});
