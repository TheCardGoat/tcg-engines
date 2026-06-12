import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { oneJumpAhead } from "../../001/actions/164-one-jump-ahead";
import { signedContract } from "./101-signed-contract";

const signedContractDraw = createMockCharacter({
  id: "signed-contract-draw",
  name: "Signed Contract Draw",
  cost: 1,
});

const oneJumpAheadInk = createMockCharacter({
  id: "signed-contract-ink",
  name: "Signed Contract Ink",
  cost: 1,
});

describe("Signed Contract", () => {
  it("lets you draw a card when an opponent plays a song", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: [signedContractDraw],
        play: [signedContract],
      },
      {
        hand: [oneJumpAhead],
        inkwell: oneJumpAhead.cost,
        deck: [oneJumpAheadInk],
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().playCard(oneJumpAhead)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(testEngine.asPlayerOne().resolvePendingByCard(signedContract)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(signedContractDraw)).toBe("hand");
  });
});
