import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mikeWazowskiWellroundedEntertainer } from "./021-mike-wazowski-well-rounded-entertainer";

const loreTarget = createMockCharacter({
  id: "mike-well-rounded-lore-target",
  name: "Lore Target",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Mike Wazowski - Well-Rounded Entertainer", () => {
  it("may pay 2 ink to give a chosen character +1 lore this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mikeWazowskiWellroundedEntertainer],
      inkwell: mikeWazowskiWellroundedEntertainer.cost + 2,
      play: [loreTarget],
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().playCard(mikeWazowskiWellroundedEntertainer),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(mikeWazowskiWellroundedEntertainer, {
        resolveOptional: true,
        targets: [loreTarget],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().quest(loreTarget)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(2);
  });

  it("stops giving the chosen character +1 lore after the turn ends", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mikeWazowskiWellroundedEntertainer],
      inkwell: mikeWazowskiWellroundedEntertainer.cost + 2,
      play: [loreTarget],
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().playCard(mikeWazowskiWellroundedEntertainer),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(mikeWazowskiWellroundedEntertainer, {
        resolveOptional: true,
        targets: [loreTarget],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().quest(loreTarget)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(1);
  });
});
