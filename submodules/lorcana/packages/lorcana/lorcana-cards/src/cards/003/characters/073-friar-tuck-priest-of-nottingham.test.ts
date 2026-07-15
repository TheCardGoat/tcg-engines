import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { liloGalacticHero, mickeyMouseDetective, stitchNewDog } from "../../001/characters";
import { friarTuckPriestOfNottingham } from "./073-friar-tuck-priest-of-nottingham";

describe("Friar Tuck - Priest of Nottingham", () => {
  it("makes both players discard when the largest hand size is tied", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [friarTuckPriestOfNottingham, liloGalacticHero],
        inkwell: friarTuckPriestOfNottingham.cost,
      },
      {
        hand: [stitchNewDog],
      },
    );

    expect(testEngine.asPlayerOne().playCard(friarTuckPriestOfNottingham)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagEffects()).toHaveLength(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(friarTuckPriestOfNottingham),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().respondWith(liloGalacticHero)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().respondWith(stitchNewDog)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 0, discard: 1, play: 1 });
    expect(testEngine.asPlayerTwo()).toHaveZoneCounts({ hand: 0, discard: 1 });
  });

  it("makes only the opponent discard when they alone have the largest hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [friarTuckPriestOfNottingham, liloGalacticHero],
        inkwell: friarTuckPriestOfNottingham.cost,
      },
      {
        hand: [stitchNewDog, mickeyMouseDetective],
      },
    );

    expect(testEngine.asPlayerOne().playCard(friarTuckPriestOfNottingham)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagEffects()).toHaveLength(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(friarTuckPriestOfNottingham),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().respondWith(stitchNewDog)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1, discard: 0, play: 1 });
    expect(testEngine.asPlayerTwo()).toHaveZoneCounts({ hand: 1, discard: 1 });
  });
});
