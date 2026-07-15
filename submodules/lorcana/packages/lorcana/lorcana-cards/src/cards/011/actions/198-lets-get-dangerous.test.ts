import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { dragonFire, mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001";
import { letsGetDangerous } from "./198-lets-get-dangerous";

describe("Let's Get Dangerous", () => {
  it("lets the active player play a revealed character for free and bottoms a revealed non-character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [letsGetDangerous],
        inkwell: letsGetDangerous.cost,
        deck: [simbaProtectiveCub],
      },
      {
        deck: [dragonFire],
      },
    );

    expect(testEngine.asPlayerOne().playCard(letsGetDangerous)).toBeSuccessfulCommand();
    // P1 resolves their scry — play Simba for free
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [{ zone: "play", cards: [simbaProtectiveCub] }],
      }),
    ).toBeSuccessfulCommand();
    // P2's dragonFire (non-character) doesn't match — goes to bottom
    expect(
      testEngine.asPlayerTwo().resolveNextPending({ destinations: [] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("play");
    expect(testEngine.asPlayerTwo().getCardZone(dragonFire)).toBe("deck");
  });

  it("puts a non-character card on the bottom of deck", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [letsGetDangerous],
        inkwell: letsGetDangerous.cost,
        deck: [dragonFire],
      },
      {
        deck: [],
      },
    );

    expect(testEngine.asPlayerOne().playCard(letsGetDangerous)).toBeSuccessfulCommand();

    // P1's dragonFire (non-character) doesn't match — goes to bottom
    expect(
      testEngine.asPlayerOne().resolveNextPending({ destinations: [] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(dragonFire)).toBe("deck");
    expect(testEngine.asPlayerOne().getCardZone(letsGetDangerous)).toBe("discard");
  });

  it("allows player to decline playing a revealed character (put on bottom)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [letsGetDangerous],
        inkwell: letsGetDangerous.cost,
        deck: [simbaProtectiveCub],
      },
      {
        deck: [],
      },
    );

    expect(testEngine.asPlayerOne().playCard(letsGetDangerous)).toBeSuccessfulCommand();

    // Decline playing — resolve scry with empty destinations, Simba goes to deck-bottom (remainder)
    expect(
      testEngine.asPlayerOne().resolveNextPending({ destinations: [] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("deck");
    expect(testEngine.asPlayerOne().getCardZone(letsGetDangerous)).toBe("discard");
  });

  it("handles mixed choices across both players", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [letsGetDangerous],
        inkwell: letsGetDangerous.cost,
        deck: [simbaProtectiveCub],
      },
      {
        deck: [mickeyMouseTrueFriend],
      },
    );

    expect(testEngine.asPlayerOne().playCard(letsGetDangerous)).toBeSuccessfulCommand();
    // P1 plays Simba for free
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [{ zone: "play", cards: [simbaProtectiveCub] }],
      }),
    ).toBeSuccessfulCommand();
    // P2 declines — Mickey goes to deck-bottom
    expect(
      testEngine.asPlayerTwo().resolveNextPending({ destinations: [] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("play");
    expect(testEngine.asPlayerTwo().getCardZone(mickeyMouseTrueFriend)).toBe("deck");
  });

  it("both players reveal characters and play them", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [letsGetDangerous],
        inkwell: letsGetDangerous.cost,
        deck: [simbaProtectiveCub],
      },
      {
        deck: [mickeyMouseTrueFriend],
      },
    );

    expect(testEngine.asPlayerOne().playCard(letsGetDangerous)).toBeSuccessfulCommand();

    // Player one plays their revealed character
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [{ zone: "play", cards: [simbaProtectiveCub] }],
      }),
    ).toBeSuccessfulCommand();

    // Player two also plays their revealed character
    expect(
      testEngine.asPlayerTwo().resolveNextPending({
        destinations: [{ zone: "play", cards: [mickeyMouseTrueFriend] }],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("play");
    expect(testEngine.asPlayerTwo().getCardZone(mickeyMouseTrueFriend)).toBe("play");
  });

  it.todo("regression: Bodyguard characters should prompt to exert when played free via Let's Get Dangerous", () => {});

  it.todo("card moved to hand before modal resolution (play mode) should not be played", () => {});

  it.todo("card moved to hand before modal resolution (bottom mode) should not move it", () => {});
});
