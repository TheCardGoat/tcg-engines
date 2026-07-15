import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { gastonArrogantShowoff } from "./129-gaston-arrogant-showoff";

const ownItem = createMockItem({
  id: "gaston-showoff-own-item",
  name: "Own Item",
  cost: 1,
});

const targetCharacter = createMockCharacter({
  id: "gaston-showoff-target",
  name: "Target Character",
  cost: 2,
  strength: 3,
  willpower: 3,
});

describe("Gaston - Arrogant Showoff", () => {
  it("may banish one of your items to give a chosen character +2 strength this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [gastonArrogantShowoff],
      inkwell: gastonArrogantShowoff.cost,
      play: [ownItem, targetCharacter],
    });

    expect(testEngine.asPlayerOne().playCard(gastonArrogantShowoff)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(gastonArrogantShowoff, {
        resolveOptional: true,
        targets: [ownItem],
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: [targetCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(ownItem)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(
      targetCharacter.strength + 2,
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(
      targetCharacter.strength,
    );
  });

  it("does nothing when the optional trigger is declined", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [gastonArrogantShowoff],
      inkwell: gastonArrogantShowoff.cost,
      play: [ownItem, targetCharacter],
    });

    expect(testEngine.asPlayerOne().playCard(gastonArrogantShowoff)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(gastonArrogantShowoff, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(ownItem)).toBe("play");
    expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(
      targetCharacter.strength,
    );
  });
});
