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

const mirrorResidentThree = createMockCharacter({
  id: "mirror-resident-three",
  name: "Mirror Resident Three",
  cost: 2,
});

const drawOne = createMockCharacter({ id: "mirror-draw-one", name: "Mirror Draw One", cost: 1 });
const drawTwo = createMockCharacter({ id: "mirror-draw-two", name: "Mirror Draw Two", cost: 1 });
const drawThree = createMockCharacter({ id: "turn-draw", name: "Turn Draw", cost: 1 });
const drawFour = createMockCharacter({ id: "extra-draw", name: "Extra Draw", cost: 1 });
const drawFive = createMockCharacter({ id: "extra-draw-two", name: "Extra Draw Two", cost: 1 });
const drawSix = createMockCharacter({ id: "extra-draw-three", name: "Extra Draw Three", cost: 1 });

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
    void bagEffect;
    // for-each optional: each character is an independent "you may draw".
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(theQueensCastleMirrorChamber, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(theQueensCastleMirrorChamber, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    // 2 draws from ability (one per character at location) + 1 start-of-turn draw = 3
    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 3,
        deck: 1,
      }),
    );
  });

  it("preserves later for-each optional draws after mid-loop prompts (3+ characters)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [drawOne, drawTwo, drawThree, drawFour, drawFive, drawSix],
      play: [
        theQueensCastleMirrorChamber,
        { card: mirrorResidentOne, atLocation: theQueensCastleMirrorChamber },
        { card: mirrorResidentTwo, atLocation: theQueensCastleMirrorChamber },
        { card: mirrorResidentThree, atLocation: theQueensCastleMirrorChamber },
      ],
    });

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    // First accept drains the bag item and stages remaining for-each iterations
    // on the pending continuation; later accepts resume those remaining mays.
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(theQueensCastleMirrorChamber, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({ resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({ resolveOptional: true }),
    ).toBeSuccessfulCommand();

    // 3 ability draws + 1 start-of-turn draw = 4
    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 4,
      }),
    );
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asServer().getState().G.pendingEffects).toHaveLength(0);
  });

  it("keeps later for-each mays after declining the first optional draw", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [drawOne, drawTwo, drawThree, drawFour, drawFive, drawSix],
      play: [
        theQueensCastleMirrorChamber,
        { card: mirrorResidentOne, atLocation: theQueensCastleMirrorChamber },
        { card: mirrorResidentTwo, atLocation: theQueensCastleMirrorChamber },
        { card: mirrorResidentThree, atLocation: theQueensCastleMirrorChamber },
      ],
    });

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    // Decline first may; remaining two independent mays must still be offered.
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(theQueensCastleMirrorChamber, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({ resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({ resolveOptional: true }),
    ).toBeSuccessfulCommand();

    // 2 ability draws (first declined) + 1 start-of-turn draw = 3
    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 3,
      }),
    );
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asServer().getState().G.pendingEffects).toHaveLength(0);
  });
});
