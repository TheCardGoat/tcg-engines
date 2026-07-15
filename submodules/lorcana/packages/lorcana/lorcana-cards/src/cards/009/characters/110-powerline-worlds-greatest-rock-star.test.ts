import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { powerlineWorldsGreatestRockStar } from "./110-powerline-worlds-greatest-rock-star";
import { bePrepared } from "../../001/actions/128-be-prepared";
import { beKingUndisputed } from "../../009/actions/133-be-king-undisputed";
import { magicBroomLivelySweeper } from "../../004/characters/049-magic-broom-lively-sweeper";

const singableSong = createMockSong({
  id: "powerline-sing-song",
  name: "Singable Song",
  cost: 3,
  text: "A cheap song for singing.",
  abilities: [],
});

// A song that qualifies for MASH-UP's play-for-free (cost <= 9)
const qualifyingSong = createMockSong({
  id: "powerline-qualifying-song",
  name: "Qualifying Song",
  cost: 5,
  text: "A qualifying song for MASH-UP.",
  abilities: [],
});

const deckFillerA = createMockCharacter({ id: "powerline-filler-a", name: "Filler A", cost: 1 });
const deckFillerB = createMockCharacter({ id: "powerline-filler-b", name: "Filler B", cost: 2 });
const deckFillerC = createMockCharacter({ id: "powerline-filler-c", name: "Filler C", cost: 3 });
const deckFillerD = createMockCharacter({ id: "powerline-filler-d", name: "Filler D", cost: 4 });

describe("Powerline - World's Greatest Rock Star", () => {
  // MASH-UP - "Once during your turn, whenever this character sings a song,
  // look at the top 4 cards of your deck. You may reveal a song card with cost 9 or less
  // and play it for free. Put the rest on the bottom of your deck in any order."

  it("MASH-UP - triggers scry when singing a song", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [singableSong],
      inkwell: singableSong.cost,
      deck: [deckFillerA, deckFillerB, deckFillerC, deckFillerD],
      play: [{ card: powerlineWorldsGreatestRockStar, isDrying: false }],
    });

    expect(
      testEngine.asPlayerOne().singSong(singableSong, powerlineWorldsGreatestRockStar),
    ).toBeSuccessfulCommand();

    // The sing trigger should create a bag for the scry effect
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
  });

  it("MASH-UP - plays a qualifying song for free when resolving the scry bag", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [singableSong],
      inkwell: singableSong.cost,
      // qualifyingSong is at top of deck so it's in the looked-at 4 cards
      deck: [qualifyingSong, deckFillerA, deckFillerB, deckFillerC],
      play: [{ card: powerlineWorldsGreatestRockStar, isDrying: false }],
    });

    expect(
      testEngine.asPlayerOne().singSong(singableSong, powerlineWorldsGreatestRockStar),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;

    // Resolve the scry: play the qualifying song for free; put the rest on the bottom
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(powerlineWorldsGreatestRockStar, {
        destinations: [
          { zone: "play", cards: [qualifyingSong] },
          { zone: "deck-bottom", cards: [deckFillerA, deckFillerB, deckFillerC] },
        ],
      }),
    ).toBeSuccessfulCommand();

    // The qualifying song was played for free as an action card, so it ends up in discard
    expect(testEngine.getCardDefinitionIdsInZone("discard", "player_one")).toContain(
      qualifyingSong.id,
    );
  });

  it("regression: free song from MASH-UP resolves correctly (does not get stuck)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [singableSong],
      inkwell: singableSong.cost,
      deck: [qualifyingSong, deckFillerA, deckFillerB, deckFillerC],
      play: [{ card: powerlineWorldsGreatestRockStar, isDrying: false }],
    });

    expect(
      testEngine.asPlayerOne().singSong(singableSong, powerlineWorldsGreatestRockStar),
    ).toBeSuccessfulCommand();

    const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;

    const resolveResult = testEngine
      .asPlayerOne()
      .resolvePendingByCard(powerlineWorldsGreatestRockStar, {
        destinations: [
          { zone: "play", cards: [qualifyingSong] },
          { zone: "deck-bottom", cards: [deckFillerA, deckFillerB, deckFillerC] },
        ],
      });

    expect(resolveResult).toBeSuccessfulCommand();
  });

  it("Be King Undisputed must fully resolve before MASH-UP can resolve", () => {
    // Be King Undisputed creates a pending effect (opponent chooses who to banish).
    // CR 7.7.3.1: the MASH-UP trigger fires when the sing condition is met, but
    // resolution is deferred until the song's effect fully resolves.
    // Sequence: sing → trigger buffered → pending (opponent chooses) → song resolves → MASH-UP resolves.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: powerlineWorldsGreatestRockStar, isDrying: false }],
        hand: [beKingUndisputed],
        inkwell: beKingUndisputed.cost,
        deck: [deckFillerA, deckFillerB, deckFillerC, deckFillerD],
      },
      {
        play: [magicBroomLivelySweeper],
      },
    );

    // Powerline sings Be King Undisputed — song effect suspends for opponent to choose
    expect(
      testEngine.asPlayerOne().singSong(beKingUndisputed, powerlineWorldsGreatestRockStar),
    ).toBeSuccessfulCommand();

    // CR 7.7.3.1: the MASH-UP trigger fires when the sing condition is met, but
    // resolution is deferred until the song's effect fully resolves. While the
    // song's pending effect is outstanding, the trigger is buffered in pendingEvents
    // and not yet visible as a resolvable bag entry.
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

    // Opponent resolves the pending effect: chooses Magic Broom to be banished
    expect(
      testEngine.asPlayerTwo().resolveNextPending({ targets: [magicBroomLivelySweeper] }),
    ).toBeSuccessfulCommand();

    // Magic Broom is now banished
    expect(testEngine.asPlayerTwo().getCardZone(magicBroomLivelySweeper)).toBe("discard");

    // Now MASH-UP trigger has fired and is in the bag
    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
  });

  it("MASH-UP remains resolvable after singing Be Prepared banishes Powerline", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: powerlineWorldsGreatestRockStar, isDrying: false }],
      hand: [bePrepared],
      inkwell: bePrepared.cost,
      deck: [deckFillerA, deckFillerB, deckFillerC, deckFillerD],
    });

    expect(
      testEngine.asPlayerOne().singSong(bePrepared, powerlineWorldsGreatestRockStar),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(powerlineWorldsGreatestRockStar)).toBe("discard");
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(powerlineWorldsGreatestRockStar, {
        destinations: [
          { zone: "deck-bottom", cards: [deckFillerA, deckFillerB, deckFillerC, deckFillerD] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getCardZone(powerlineWorldsGreatestRockStar)).toBe("discard");
  });
});
