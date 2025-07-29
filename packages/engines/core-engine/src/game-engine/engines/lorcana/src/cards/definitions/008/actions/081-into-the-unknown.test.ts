import { describe, expect, it } from "bun:test";
import { cinderellaBallroomSensation } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { intoTheUnknown } from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
