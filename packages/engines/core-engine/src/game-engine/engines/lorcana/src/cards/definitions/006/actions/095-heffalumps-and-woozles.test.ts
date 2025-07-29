import { describe, expect, it } from "bun:test";
import {
  liloMakingAWish,
  megaraPullingTheStrings,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import {
  cogsworthGrandfatherClock,
  hiramFlavershamToymaker,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { tipoGrowingSon } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters";
import { heffalumpsAndWoozles } from "~/game-engine/engines/lorcana/src/cards/definitions/006/actions";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Heffalumps And Woozles", () => {
  it("(A character with cost 2 or more can {E} to sing this song for free.)", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: heffalumpsAndWoozles.cost,
        hand: [heffalumpsAndWoozles],
        deck: [hiramFlavershamToymaker],
      },
      { play: [tipoGrowingSon] },
    );

    await testEngine.playCard(heffalumpsAndWoozles);

    const target = testEngine.getCardModel(tipoGrowingSon);

    expect(testEngine.stackLayers).toHaveLength(1);
    await testEngine.resolveTopOfStack({ targets: [target] });
    expect(testEngine.stackLayers).toHaveLength(0);
    expect(testEngine.getZonesCardCount().hand).toEqual(1);
  });

  it("NO OPPOSING CHARACTER IN PLAY - Chosen opposing character can't quest during their next turn. Draw a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: heffalumpsAndWoozles.cost,
      hand: [heffalumpsAndWoozles],
      deck: [tipoGrowingSon],
    });

    await testEngine.playCard(heffalumpsAndWoozles);
    expect(testEngine.stackLayers).toHaveLength(0);
    expect(testEngine.getZonesCardCount().hand).toEqual(1);
  });

  it("WARDED OPPOSING CHARACTER IN PLAY - Chosen opposing character can't quest during their next turn. Draw a card.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: heffalumpsAndWoozles.cost,
        hand: [heffalumpsAndWoozles],
        deck: [tipoGrowingSon],
      },
      { play: [cogsworthGrandfatherClock] },
    );

    await testEngine.playCard(heffalumpsAndWoozles);
    expect(testEngine.stackLayers).toHaveLength(0);
    expect(testEngine.getZonesCardCount().hand).toEqual(1);
  });
});
