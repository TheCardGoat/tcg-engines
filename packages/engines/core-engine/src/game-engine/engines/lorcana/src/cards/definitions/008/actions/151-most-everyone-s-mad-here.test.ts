import { describe, expect, it } from "bun:test";
import {
  mickeyMouseGiantMouse,
  mostEveryonesMadHere,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Most Everyone's Mad Here", () => {
  it("Gain lore equal to the damage on chosen character, then banish them.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: mostEveryonesMadHere.cost,
        hand: [mostEveryonesMadHere],
      },
      {
        play: [mickeyMouseGiantMouse],
      },
    );

    await testEngine.setCardDamage(mickeyMouseGiantMouse, 5);

    await testEngine.playCard(mostEveryonesMadHere, {
      targets: [mickeyMouseGiantMouse],
    });

    expect(testEngine.getCardModel(mickeyMouseGiantMouse).zone).toBe("discard");
    expect(testEngine.getPlayerLore("player_one")).toBe(5);
    expect(testEngine.getPlayerLore("player_two")).toBe(0);
  });

  it("Character with no damage", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: mostEveryonesMadHere.cost,
        hand: [mostEveryonesMadHere],
      },
      {
        play: [mickeyMouseGiantMouse],
      },
    );

    await testEngine.playCard(mostEveryonesMadHere, {
      targets: [mickeyMouseGiantMouse],
    });

    expect(testEngine.getCardModel(mickeyMouseGiantMouse).zone).toBe("discard");
    expect(testEngine.getPlayerLore("player_one")).toBe(0);
    expect(testEngine.getPlayerLore("player_two")).toBe(0);
  });
});
