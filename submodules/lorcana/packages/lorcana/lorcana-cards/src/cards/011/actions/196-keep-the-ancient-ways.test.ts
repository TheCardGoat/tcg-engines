import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { dragonFire, simbaProtectiveCub } from "../../001";
import { dinglehopper } from "../../001/items";
import { tamatoaHappyAsAClam } from "../../007/characters/162-tamatoa-happy-as-a-clam";
import { sapphireCoil } from "../../007/items/179-sapphire-coil";
import { keepTheAncientWays } from "./196-keep-the-ancient-ways";

describe("Keep the Ancient Ways", () => {
  it("stops opponents from playing actions and items until your next turn starts", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [keepTheAncientWays],
        inkwell: keepTheAncientWays.cost,
        deck: [keepTheAncientWays, keepTheAncientWays],
      },
      {
        hand: [dragonFire, dinglehopper, simbaProtectiveCub],
        deck: [dragonFire, dinglehopper],
        inkwell: 10,
      },
    );

    expect(testEngine.asPlayerOne().playCard(keepTheAncientWays)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().hasPlayerRestriction(PLAYER_TWO, "cant-play-actions")).toBe(
      true,
    );
    expect(testEngine.asPlayerOne().hasPlayerRestriction(PLAYER_TWO, "cant-play-items")).toBe(true);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().canPlayCard(dragonFire)).toBe(false);
    expect(testEngine.asPlayerTwo().canPlayCard(dinglehopper)).toBe(false);
    expect(testEngine.asPlayerTwo().playCard(dragonFire).success).toBe(false);
    expect(testEngine.asPlayerTwo().playCard(dinglehopper).success).toBe(false);
    expect(testEngine.asPlayerTwo().playCard(simbaProtectiveCub)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().canPlayCard(dragonFire)).toBe(true);
    expect(testEngine.asPlayerTwo().canPlayCard(dinglehopper)).toBe(true);
    expect(testEngine.asPlayerTwo().playCard(dinglehopper)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().playCard(dragonFire, { targets: [simbaProtectiveCub] }).success,
    ).toBe(true);
  });

  it("regression: prevents Tamatoa - Happy as a Clam from playing items via ability while restriction is active", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [keepTheAncientWays],
        inkwell: keepTheAncientWays.cost,
        deck: 2,
      },
      {
        play: [{ card: tamatoaHappyAsAClam, isDrying: false }],
        hand: [sapphireCoil],
        deck: 2,
      },
    );

    // Player one plays Keep the Ancient Ways
    expect(testEngine.asPlayerOne().playCard(keepTheAncientWays)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().hasPlayerRestriction(PLAYER_TWO, "cant-play-items")).toBe(true);

    // Pass to opponent's turn
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Opponent quests with Tamatoa, which triggers "I'M BEAUTIFUL, BABY!" (play item for free)
    expect(testEngine.asPlayerTwo().quest(tamatoaHappyAsAClam)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getBagEffects()).toHaveLength(1);

    expect(
      testEngine.asPlayerTwo().resolvePendingByCard(tamatoaHappyAsAClam, {
        resolveOptional: true,
        targets: [sapphireCoil],
      }),
    ).toBeSuccessfulCommand();

    // The item should still be in hand - the restriction prevents playing it
    expect(testEngine.asPlayerTwo().getCardZone(sapphireCoil)).toBe("hand");
  });
});
