import { describe, expect, it } from "bun:test";
import { ryderFleetfootedInfiltrator } from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { timothyQMouseFlightInstructor } from "./047-timothy-q-mouse-flight-instructor";

describe("Timothy Q. Mouse - Flight Instructor", () => {
  it("LET'S SHOW 'EM, DUMBO! While you have a character with Evasive in play, this character gets +1 {L}.", async () => {
    const testEngine = new TestEngine({
      inkwell: timothyQMouseFlightInstructor.cost,
      play: [timothyQMouseFlightInstructor, ryderFleetfootedInfiltrator],
    });

    const cardUnderTest = testEngine.getCardModel(
      timothyQMouseFlightInstructor,
    );

    expect(cardUnderTest.lore).toBe(timothyQMouseFlightInstructor.lore + 1);
  });
});
