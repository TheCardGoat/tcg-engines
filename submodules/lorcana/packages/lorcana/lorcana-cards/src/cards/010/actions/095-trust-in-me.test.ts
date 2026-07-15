import { describe, expect, it } from "bun:test";
import { PLAYER_ONE, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend, moanaOfMotunui, simbaProtectiveCub } from "../../001/characters";
import { princeNaveenUkulelePlayer } from "../../005/characters";
import { balooFriendAndGuardian, duckworthGhostButler } from "../characters";
import { trustInMe } from "./095-trust-in-me";

describe("Trust In Me", () => {
  it("exposes derived mode labels when optionLabels are not authored", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [trustInMe],
        inkwell: trustInMe.cost,
        play: [balooFriendAndGuardian],
      },
      {
        play: [duckworthGhostButler],
      },
    );

    expect(testEngine.asPlayerOne().playCard(trustInMe).success).toBe(true);

    const pendingEffects = testEngine.asPlayerOne().getPendingEffects();
    expect(pendingEffects).toHaveLength(1);
    const selectionContext = pendingEffects[0]?.selectionContext;
    expect(selectionContext?.kind).toBe("choice-selection");
    if (selectionContext?.kind !== "choice-selection") {
      throw new Error("expected choice-selection context");
    }

    expect(selectionContext.options.map((option) => option.label)).toEqual([
      "Chosen character gets -1 lore.",
      "Discard 2 cards.",
    ]);
  });

  it("gives each opposing character -1 lore until the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [trustInMe],
        inkwell: trustInMe.cost,
        play: [balooFriendAndGuardian],
      },
      {
        play: [duckworthGhostButler],
      },
    );

    const playerOne = testEngine.asPlayerOne();
    const playerTwo = testEngine.asPlayerTwo();

    expect(playerOne.playCardWithChoice(trustInMe, 0)).toBeSuccessfulCommand();
    expect(playerTwo).toHaveLore({ card: duckworthGhostButler, value: 1 });

    expect(playerOne.passTurn()).toBeSuccessfulCommand();
    expect(playerTwo).toHaveLore({ card: duckworthGhostButler, value: 1 });

    expect(playerTwo.passTurn()).toBeSuccessfulCommand();
    expect(playerTwo).toHaveLore({ card: duckworthGhostButler, value: 2 });
  });

  it("removes only one effective lore from characters whose lore is already increased", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [trustInMe],
        inkwell: trustInMe.cost,
        play: [balooFriendAndGuardian],
      },
      {
        play: [{ card: duckworthGhostButler, lore: 3 }],
      },
    );

    const playerOne = testEngine.asPlayerOne();
    const playerTwo = testEngine.asPlayerTwo();

    expect(playerTwo).toHaveLore({ card: duckworthGhostButler, value: 3 });
    expect(playerOne.playCardWithChoice(trustInMe, 0)).toBeSuccessfulCommand();
    expect(playerTwo).toHaveLore({ card: duckworthGhostButler, value: 2 });

    expect(playerOne.passTurn()).toBeSuccessfulCommand();
    expect(playerTwo).toHaveLore({ card: duckworthGhostButler, value: 2 });

    expect(playerTwo.passTurn()).toBeSuccessfulCommand();
    expect(playerTwo).toHaveLore({ card: duckworthGhostButler, value: 3 });
  });

  it("lets each opponent choose and discard 2 cards in the second mode", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [trustInMe],
        inkwell: trustInMe.cost,
        play: [balooFriendAndGuardian],
      },
      {
        hand: [duckworthGhostButler, mickeyMouseTrueFriend, simbaProtectiveCub],
      },
    );

    const playerOne = testEngine.asPlayerOne();
    const playerTwo = testEngine.asPlayerTwo();
    const duckworthId = testEngine.findCardInstanceId(duckworthGhostButler, "hand", "p2");
    const mickeyId = testEngine.findCardInstanceId(mickeyMouseTrueFriend, "hand", "p2");

    expect(playerOne.playCardWithChoice(trustInMe, 1)).toBeSuccessfulCommand();
    expect(playerTwo.respondWith(duckworthId, mickeyId)).toBeSuccessfulCommand();

    expect(playerTwo).toHaveZoneCounts({ hand: 1, discard: 2 });
  });

  it("regression: lore reduction persists through opponent's turn (does not wear off prematurely)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [trustInMe],
        inkwell: trustInMe.cost,
        play: [balooFriendAndGuardian],
        deck: 2,
      },
      {
        play: [{ card: duckworthGhostButler, isDrying: false }],
        deck: 2,
      },
    );

    const playerOne = testEngine.asPlayerOne();
    const playerTwo = testEngine.asPlayerTwo();

    // Play Trust In Me choosing lore reduction mode
    expect(playerOne.playCardWithChoice(trustInMe, 0)).toBeSuccessfulCommand();

    // Duckworth normally has 2 lore, should now have 1 lore
    expect(playerTwo).toHaveLore({ card: duckworthGhostButler, value: 1 });

    // Pass to opponent's turn
    expect(playerOne.passTurn()).toBeSuccessfulCommand();

    // During opponent's turn, the reduction should still be active
    expect(playerTwo).toHaveLore({ card: duckworthGhostButler, value: 1 });

    // Quest with reduced lore - should only gain 1 lore instead of 2
    expect(playerTwo.quest(duckworthGhostButler)).toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
    // The opponent should have gained only 1 lore from questing
    expect(testEngine.getLore("player_two")).toBe(1);
  });

  it("can be sung for free and still choose a mode", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [trustInMe],
        play: [princeNaveenUkulelePlayer],
      },
      {
        play: [duckworthGhostButler, moanaOfMotunui],
      },
    );
    const singerId = testEngine.findCardInstanceId(princeNaveenUkulelePlayer, "play", "p1");

    const result = testEngine.asPlayerOne().playCard(trustInMe, {
      cost: { cost: "sing", singer: singerId },
      choiceIndex: 0,
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo()).toHaveLore({ card: duckworthGhostButler, value: 1 });
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
  });
});
