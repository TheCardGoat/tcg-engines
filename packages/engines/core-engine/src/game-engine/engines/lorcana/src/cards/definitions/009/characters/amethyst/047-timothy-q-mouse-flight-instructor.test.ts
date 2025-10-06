/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { ryderFleetfootedInfiltrator } from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { timothyQMouseFlightInstructor } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";

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
