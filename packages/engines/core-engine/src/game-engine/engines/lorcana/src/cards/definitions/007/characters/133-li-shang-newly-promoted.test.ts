/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { tipoGrowingSon } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";
import { liShangNewlyPromoted } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";

describe("Li Shang - Newly Promoted", () => {
  it("I WON'T LET YOU DOWN This character can challenge ready characters.", async () => {
    const testEngine = new TestEngine(
      {
        play: [liShangNewlyPromoted],
      },
      {
        play: [tipoGrowingSon],
      },
    );

    const cardUnderTest = testEngine.getCardModel(liShangNewlyPromoted);
    const target = testEngine.getCardModel(tipoGrowingSon);

    target.updateCardMeta({ exerted: true });
    cardUnderTest.challenge(target);

    expect(testEngine.getCardZone(target)).toBe("discard");
  });

  it("BIG RESPONSIBILITY While this character is damaged, he gets +2 {S}.", async () => {
    const testEngine = new TestEngine({
      play: [liShangNewlyPromoted],
    });

    const cardUnderTest = testEngine.getCardModel(liShangNewlyPromoted);
    expect(cardUnderTest.strength).toBe(2);
    await testEngine.setCardDamage(cardUnderTest, 1);
    expect(cardUnderTest.strength).toBe(4);
  });
});
