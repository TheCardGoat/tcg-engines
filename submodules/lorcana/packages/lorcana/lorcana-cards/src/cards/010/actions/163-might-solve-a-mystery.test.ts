import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { goofyKnightForADay } from "../../002";
import { balooFriendAndGuardian } from "../characters/001-baloo-friend-and-guardian";
import { mowgliManCub } from "../characters/019-mowgli-man-cub";
import { recoveredPage } from "../items/030-recovered-page";
import { fairyGodmothersWand } from "../items/168-fairy-godmothers-wand";
import { duckburgFunsosFunzone } from "../locations/034-duckburg-funsos-funzone";
import { sleepyHollowTheBridge } from "../locations/136-sleepy-hollow-the-bridge";
import { mightSolveAMystery } from "./163-might-solve-a-mystery";

describe("Might Solve a Mystery", () => {
  it("puts up to one character and one item into hand and the rest on the bottom", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mightSolveAMystery],
      inkwell: mightSolveAMystery.cost,
      deck: [
        sleepyHollowTheBridge,
        goofyKnightForADay,
        fairyGodmothersWand,
        mowgliManCub,
        duckburgFunsosFunzone,
      ],
    });

    const playResult = testEngine.asPlayerOne().playCardWithDestinations(
      mightSolveAMystery,
      {
        zone: "hand",
        cards: mowgliManCub,
      },
      {
        zone: "hand",
        cards: fairyGodmothersWand,
      },
      {
        zone: "deck-bottom",
        cards: [duckburgFunsosFunzone, goofyKnightForADay],
      },
    );

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(mowgliManCub)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(fairyGodmothersWand)).toBe("hand");

    const deckIds = testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE);
    expect(deckIds.slice(0, 2)).toEqual([goofyKnightForADay.id, duckburgFunsosFunzone.id]);
  });

  it("choosing only a character, no item", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mightSolveAMystery],
      inkwell: mightSolveAMystery.cost,
      deck: [
        mowgliManCub,
        fairyGodmothersWand,
        sleepyHollowTheBridge,
        goofyKnightForADay,
        duckburgFunsosFunzone,
      ],
    });

    // First "hand" destination is for characters, second for items (matching ability definition order)
    const playResult = testEngine.asPlayerOne().playCardWithDestinations(
      mightSolveAMystery,
      {
        zone: "hand",
        cards: goofyKnightForADay,
      },
      {
        zone: "deck-bottom",
        cards: [fairyGodmothersWand, sleepyHollowTheBridge, duckburgFunsosFunzone],
      },
    );

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(goofyKnightForADay)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(fairyGodmothersWand)).not.toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(sleepyHollowTheBridge)).not.toBe("hand");
  });

  it("choosing only an item, no character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mightSolveAMystery],
      inkwell: mightSolveAMystery.cost,
      deck: [
        mowgliManCub,
        fairyGodmothersWand,
        sleepyHollowTheBridge,
        goofyKnightForADay,
        duckburgFunsosFunzone,
      ],
    });

    // Send empty character destination first, then item destination
    const playResult = testEngine.asPlayerOne().playCardWithDestinations(
      mightSolveAMystery,
      {
        zone: "hand",
        cards: [],
      },
      {
        zone: "hand",
        cards: fairyGodmothersWand,
      },
      {
        zone: "deck-bottom",
        cards: [mowgliManCub, sleepyHollowTheBridge, goofyKnightForADay],
      },
    );

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(fairyGodmothersWand)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(mowgliManCub)).not.toBe("hand");
  });

  it("choosing nothing - all go to bottom", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mightSolveAMystery],
      inkwell: mightSolveAMystery.cost,
      deck: [
        mowgliManCub,
        fairyGodmothersWand,
        sleepyHollowTheBridge,
        goofyKnightForADay,
        duckburgFunsosFunzone,
      ],
    });

    const playResult = testEngine.asPlayerOne().playCardWithDestinations(mightSolveAMystery, {
      zone: "deck-bottom",
      cards: [mowgliManCub, fairyGodmothersWand, sleepyHollowTheBridge, goofyKnightForADay],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(mowgliManCub)).not.toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(fairyGodmothersWand)).not.toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(sleepyHollowTheBridge)).not.toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(goofyKnightForADay)).not.toBe("hand");
  });

  it("enforces limit of 1 character to hand (excess characters go to bottom)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mightSolveAMystery],
      inkwell: mightSolveAMystery.cost,
      deck: [
        mowgliManCub,
        balooFriendAndGuardian,
        fairyGodmothersWand,
        goofyKnightForADay,
        duckburgFunsosFunzone,
      ],
    });

    // Try to put 2 characters in the first hand destination (max: 1)
    const playResult = testEngine.asPlayerOne().playCardWithDestinations(
      mightSolveAMystery,
      {
        zone: "hand",
        cards: [balooFriendAndGuardian, goofyKnightForADay],
      },
      {
        zone: "hand",
        cards: fairyGodmothersWand,
      },
      {
        zone: "deck-bottom",
        cards: [duckburgFunsosFunzone],
      },
    );

    expect(playResult).toBeSuccessfulCommand();
    // Only the first character should be taken (max: 1)
    expect(testEngine.asPlayerOne().getCardZone(balooFriendAndGuardian)).toBe("hand");
    // The second character is silently truncated by the engine and goes to remainder (bottom)
    expect(testEngine.asPlayerOne().getCardZone(goofyKnightForADay)).not.toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(fairyGodmothersWand)).toBe("hand");
  });

  it("enforces limit of 1 item to hand (excess items go to bottom)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mightSolveAMystery],
      inkwell: mightSolveAMystery.cost,
      deck: [
        mowgliManCub,
        fairyGodmothersWand,
        recoveredPage,
        goofyKnightForADay,
        duckburgFunsosFunzone,
      ],
    });

    // Try to put 2 items in the second hand destination (max: 1)
    const playResult = testEngine.asPlayerOne().playCardWithDestinations(
      mightSolveAMystery,
      {
        zone: "hand",
        cards: goofyKnightForADay,
      },
      {
        zone: "hand",
        cards: [fairyGodmothersWand, recoveredPage],
      },
      {
        zone: "deck-bottom",
        cards: [duckburgFunsosFunzone],
      },
    );

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(goofyKnightForADay)).toBe("hand");
    // Only the first item should be taken (max: 1)
    expect(testEngine.asPlayerOne().getCardZone(fairyGodmothersWand)).toBe("hand");
    // The second item is silently truncated by the engine and goes to remainder (bottom)
    expect(testEngine.asPlayerOne().getCardZone(recoveredPage)).not.toBe("hand");
  });
});
