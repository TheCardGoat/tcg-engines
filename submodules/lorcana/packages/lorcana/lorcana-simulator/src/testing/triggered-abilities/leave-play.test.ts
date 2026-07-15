import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { fireTheCannons, stitchNewDog } from "@tcg/lorcana-cards/cards/001";
import { olafHelpingHand } from "@tcg/lorcana-cards/cards/010";

const allyCharacter = createMockCharacter({
  id: "leave-play-ally",
  name: "Ally Character",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
});

describe("SECOND CHANCE - Olaf, Helping Hand - When this character leaves play, you may return chosen character of yours to your hand.", () => {
  it("should trigger when this character is banished by damage", () => {
    // Olaf has 1 willpower, Fire the Cannons deals 2 => banished
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [fireTheCannons],
        inkwell: fireTheCannons.cost,
        play: [olafHelpingHand, allyCharacter],
      },
      {},
    );

    expect(
      testEngine.asPlayerOne().playCard(fireTheCannons, {
        targets: [olafHelpingHand],
      }),
    ).toBeSuccessfulCommand();

    // Olaf is banished
    expect(testEngine.asPlayerOne().getCardZone(olafHelpingHand)).toBe("discard");

    // Leave-play trigger should fire (optional: return chosen character to hand)
    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
  });

  it("should allow returning an ally to hand when trigger is accepted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [fireTheCannons],
        inkwell: fireTheCannons.cost,
        play: [olafHelpingHand, allyCharacter],
      },
      {},
    );

    expect(
      testEngine.asPlayerOne().playCard(fireTheCannons, {
        targets: [olafHelpingHand],
      }),
    ).toBeSuccessfulCommand();

    // Accept and return ally to hand
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
          resolveOptional: true,
          targets: [allyCharacter],
        }),
    ).toBeSuccessfulCommand();

    // Ally should now be in hand
    expect(testEngine.asPlayerOne().getCardZone(allyCharacter)).toBe("hand");
  });

  it("should allow declining the optional trigger", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [fireTheCannons],
        inkwell: fireTheCannons.cost,
        play: [olafHelpingHand, allyCharacter],
      },
      {},
    );

    expect(
      testEngine.asPlayerOne().playCard(fireTheCannons, {
        targets: [olafHelpingHand],
      }),
    ).toBeSuccessfulCommand();

    // Decline the optional
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
          resolveOptional: false,
        }),
    ).toBeSuccessfulCommand();

    // Ally should stay in play
    expect(testEngine.asPlayerOne().getCardZone(allyCharacter)).toBe("play");
  });

  it("should trigger when banished in a challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        // Olaf needs to be exerted so opponent can challenge him
        play: [{ card: olafHelpingHand, exerted: true }, allyCharacter],
        deck: 2,
      },
      {
        // Stitch (2 str) vs Olaf (1 wp) => Olaf banished
        play: [{ card: stitchNewDog, isDrying: false }],
        deck: 2,
      },
    );

    // Pass to opponent's turn
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Opponent challenges exerted Olaf
    expect(
      testEngine.asPlayerTwo().challenge(stitchNewDog, olafHelpingHand),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(olafHelpingHand)).toBe("discard");

    // Leave-play trigger should fire
    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
  });
});
