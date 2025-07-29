import { describe, expect, it } from "bun:test";
import { arielSpectacularSinger } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import {
  allIsFound,
  scroogeMcduckResourcefulMiser,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("All Is Found", () => {
  it("Put up to 2 cards from your discard into your inkwell, facedown and exerted", async () => {
    const testEngine = new TestEngine({
      inkwell: allIsFound.cost,
      hand: [allIsFound],
      discard: [arielSpectacularSinger, scroogeMcduckResourcefulMiser],
    });

    await testEngine.playCard(allIsFound);
    await testEngine.resolveTopOfStack({
      targets: [arielSpectacularSinger, scroogeMcduckResourcefulMiser],
    });

    expect(testEngine.getCardModel(arielSpectacularSinger).zone).toBe(
      "inkwell",
    );
    expect(testEngine.getCardModel(arielSpectacularSinger).exerted).toBe(true);
    expect(testEngine.getCardModel(scroogeMcduckResourcefulMiser).zone).toBe(
      "inkwell",
    );
    expect(testEngine.getCardModel(scroogeMcduckResourcefulMiser).exerted).toBe(
      true,
    );
  });
});
