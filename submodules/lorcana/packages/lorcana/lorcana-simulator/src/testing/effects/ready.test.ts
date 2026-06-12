import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "@tcg/lorcana-cards/cards/001";
import { youCameBack } from "@tcg/lorcana-cards/cards/006";
import { littleJohnImpermanentOutlaw } from "@tcg/lorcana-cards/cards/010";

const firstDefender = createMockCharacter({
  id: "the-941-first-defender",
  name: "First Defender",
  cost: 2,
  strength: 1,
  willpower: 10,
});

const secondDefender = createMockCharacter({
  id: "the-941-second-defender",
  name: "Second Defender",
  cost: 2,
  strength: 1,
  willpower: 10,
});

describe("Ready effects - turn action eligibility", () => {
  it("regression THE-941: a character can quest again after being readied by You Came Back", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [youCameBack],
      inkwell: youCameBack.cost,
      play: [{ card: simbaProtectiveCub, isDrying: false }],
    });

    expect(testEngine.asPlayerOne().quest(simbaProtectiveCub)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(simbaProtectiveCub)).toBe(true);

    expect(
      testEngine.asPlayerOne().playCard(youCameBack, { targets: [simbaProtectiveCub] }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(simbaProtectiveCub)).toBe(false);
    const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", "player_one");
    expect(
      testEngine
        .asPlayerOne()
        .getAvailableMoves()
        .find((move) => move.moveId === "quest")?.selectableCardIds,
    ).toContain(simbaId);

    expect(testEngine.asPlayerOne().quest(simbaProtectiveCub)).toBeSuccessfulCommand();
  });

  it("a character can challenge again after Little John readies itself", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: 3,
        deck: 3,
        play: [{ card: littleJohnImpermanentOutlaw, isDrying: false }],
      },
      {
        play: [
          { card: firstDefender, exerted: true },
          { card: secondDefender, exerted: true },
        ],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(littleJohnImpermanentOutlaw, firstDefender),
    ).toBeSuccessfulCommand();
    const challengeMoveWhileExerted = testEngine
      .asPlayerOne()
      .getAvailableMoves()
      .find((move) => move.moveId === "challenge");
    expect(challengeMoveWhileExerted).toBeUndefined();

    expect(
      testEngine.asPlayerOne().activateAbility(littleJohnImpermanentOutlaw, {
        ability: "Boost",
        preventAutoResolveTriggeredEffects: true,
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(littleJohnImpermanentOutlaw, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    const littleJohnId = testEngine.findCardInstanceId(
      littleJohnImpermanentOutlaw,
      "play",
      "player_one",
    );
    const challengeMoveAfterReady = testEngine
      .asPlayerOne()
      .getAvailableMoves()
      .find((move) => move.moveId === "challenge");
    expect(challengeMoveAfterReady).toBeDefined();
    expect(challengeMoveAfterReady?.selectableCardIds).toContain(littleJohnId);

    expect(
      testEngine.asPlayerOne().challenge(littleJohnImpermanentOutlaw, secondDefender),
    ).toBeSuccessfulCommand();
  });

  it("a drying character remains unable to quest or challenge even if an effect readies it", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [youCameBack],
        inkwell: youCameBack.cost,
        play: [{ card: simbaProtectiveCub, isDrying: true, exerted: true }],
      },
      {
        play: [{ card: firstDefender, exerted: true, isDrying: false }],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(youCameBack, { targets: [simbaProtectiveCub] }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(simbaProtectiveCub)).toBe(false);

    expect(testEngine.asPlayerOne().quest(simbaProtectiveCub)).not.toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().challenge(simbaProtectiveCub, firstDefender),
    ).not.toBeSuccessfulCommand();
  });
});
