import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { belleSnowfieldStrategist } from "@tcg/lorcana-cards/cards/011";
import { bePrepared } from "@tcg/lorcana-cards/cards/001";

/**
 * THE-938:
 * Belle - Snowfield Strategist should offer an optional bag prompt when Belle is banished.
 * Repros cover challenge banish and song/action banish paths.
 */
describe("THE-938 — Belle Snowfield Strategist prompt visibility", () => {
  it("offers an optional bag prompt when Belle is banished in a challenge", () => {
    const opponentAttacker = createMockCharacter({
      id: "the-938-opponent-attacker",
      name: "THE-938 Opponent Attacker",
      cost: 3,
      strength: 4,
      willpower: 4,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: belleSnowfieldStrategist, exerted: true }],
        deck: 2,
      },
      {
        play: [opponentAttacker],
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(opponentAttacker, belleSnowfieldStrategist),
    ).toBeSuccessfulCommand();

    const belleBagEffect = testEngine
      .asPlayerOne()
      .getBagEffects()
      .find((effect) => {
        if (!effect.sourceId) {
          return false;
        }
        return testEngine.getCardDefinitionId(effect.sourceId) === belleSnowfieldStrategist.id;
      });

    expect(belleBagEffect).toBeDefined();
    expect(belleBagEffect?.selectionContext).toMatchObject({
      kind: "optional-selection",
      origin: "bag",
      submitField: "resolveOptional",
    });

    expect(
      testEngine.asPlayerOne().resolveBag(belleBagEffect!.id, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(belleSnowfieldStrategist)).toBe("inkwell");
  });

  it("offers an optional bag prompt when Belle is banished by Be Prepared", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [bePrepared],
        inkwell: bePrepared.cost,
        play: [belleSnowfieldStrategist],
        deck: 2,
      },
      { deck: 2 },
    );

    expect(testEngine.asPlayerOne().playCard(bePrepared)).toBeSuccessfulCommand();

    const belleBagEffect = testEngine
      .asPlayerOne()
      .getBagEffects()
      .find((effect) => {
        if (!effect.sourceId) {
          return false;
        }
        return testEngine.getCardDefinitionId(effect.sourceId) === belleSnowfieldStrategist.id;
      });

    expect(belleBagEffect).toBeDefined();
    expect(belleBagEffect?.selectionContext).toMatchObject({
      kind: "optional-selection",
      origin: "bag",
      submitField: "resolveOptional",
    });

    expect(
      testEngine.asPlayerOne().resolveBag(belleBagEffect!.id, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(belleSnowfieldStrategist)).toBe("inkwell");
  });
});
