import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { meridasBow } from "./101-meridas-bow";

const easyShotTarget = createMockCharacter({
  id: "meridas-bow-easy-shot-target",
  name: "Easy Shot Target",
  cost: 2,
});

const finalArrowTarget = createMockCharacter({
  id: "meridas-bow-final-arrow-target",
  name: "Final Arrow Target",
  cost: 2,
});

describe("Merida's Bow", () => {
  it("EASY SHOT - when played, deals 1 damage to chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [meridasBow],
        inkwell: meridasBow.cost,
      },
      {
        play: [easyShotTarget],
      },
    );

    expect(testEngine.asPlayerOne().playCard(meridasBow)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(meridasBow, {
        targets: [easyShotTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo()).toHaveDamage({ card: easyShotTarget, value: 1 });
  });

  it("FINAL ARROW 1 - banishes itself for 1 ink to deal 1 damage to chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: 1,
        play: [meridasBow],
      },
      {
        play: [finalArrowTarget],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(meridasBow, {
        ability: "FINAL ARROW 1",
        targets: [finalArrowTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(meridasBow)).toBe("discard");
    expect(testEngine.asPlayerTwo()).toHaveDamage({ card: finalArrowTarget, value: 1 });
  });
});
