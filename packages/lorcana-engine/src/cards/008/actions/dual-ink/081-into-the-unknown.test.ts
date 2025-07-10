/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { cinderellaBallroomSensation } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { intoTheUnknown } from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Into The Unknown", () => {
  it("(A character with cost 3 or more can {E} to sing this song for free.)", async () => {
    const testEngine = new TestEngine({
      inkwell: intoTheUnknown.cost,
      play: [cinderellaBallroomSensation],
      hand: [intoTheUnknown],
    });

    await testEngine.singSong({
      song: intoTheUnknown,
      singer: cinderellaBallroomSensation,
    });
    await testEngine.resolveTopOfStack({
      targets: [cinderellaBallroomSensation],
    });

    expect(testEngine.getCardModel(cinderellaBallroomSensation).zone).toBe(
      "inkwell",
    );
  });

  it("Put chosen exerted character into their player's inkwell facedown and exerted.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: intoTheUnknown.cost,
        play: [],
        hand: [intoTheUnknown],
      },
      {
        play: [cinderellaBallroomSensation],
        inkwell: 1,
      },
    );

    testEngine
      .getCardModel(cinderellaBallroomSensation)
      .updateCardMeta({ exerted: true });

    await testEngine.playCard(intoTheUnknown);
    await testEngine.resolveTopOfStack({
      targets: [cinderellaBallroomSensation],
    });

    expect(testEngine.getCardModel(cinderellaBallroomSensation).zone).toBe(
      "inkwell",
    );
    expect(testEngine.getCardModel(cinderellaBallroomSensation).exerted).toBe(
      true,
    );
    expect(testEngine.getAvailableInkwellCardCount("player_two")).toBe(1);
    expect(testEngine.getTotalInkwellCardCount("player_two")).toBe(2);
  });

  it("No characters in play", async () => {
    const testEngine = new TestEngine({
      inkwell: intoTheUnknown.cost,
      play: [],
      hand: [intoTheUnknown],
    });

    await testEngine.playCard(intoTheUnknown);
    expect(testEngine.stackLayers).toHaveLength(0);
  });
});
