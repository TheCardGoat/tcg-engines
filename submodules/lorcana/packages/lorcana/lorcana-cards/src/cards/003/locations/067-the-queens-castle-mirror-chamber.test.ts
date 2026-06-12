import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { theQueensCastleMirrorChamber } from "./067-the-queens-castle-mirror-chamber";

const mirrorResidentOne = createMockCharacter({
  id: "mirror-resident-one",
  name: "Mirror Resident One",
  cost: 2,
});

const mirrorResidentTwo = createMockCharacter({
  id: "mirror-resident-two",
  name: "Mirror Resident Two",
  cost: 2,
});

const drawOne = createMockCharacter({ id: "mirror-draw-one", name: "Mirror Draw One", cost: 1 });
const drawTwo = createMockCharacter({ id: "mirror-draw-two", name: "Mirror Draw Two", cost: 1 });
const drawThree = createMockCharacter({ id: "turn-draw", name: "Turn Draw", cost: 1 });
const drawFour = createMockCharacter({ id: "extra-draw", name: "Extra Draw", cost: 1 });

describe("The Queen's Castle - Mirror Chamber", () => {
  it("offers one draw for each character you have here at the start of your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [drawOne, drawTwo, drawThree, drawFour],
      play: [
        theQueensCastleMirrorChamber,
        { card: mirrorResidentOne, atLocation: theQueensCastleMirrorChamber },
        { card: mirrorResidentTwo, atLocation: theQueensCastleMirrorChamber },
      ],
    });

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(theQueensCastleMirrorChamber),
    ).toBeSuccessfulCommand();

    // 2 draws from ability (one per character at location) + 1 start-of-turn draw = 3
    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 3,
        deck: 1,
      }),
    );
  });
});
