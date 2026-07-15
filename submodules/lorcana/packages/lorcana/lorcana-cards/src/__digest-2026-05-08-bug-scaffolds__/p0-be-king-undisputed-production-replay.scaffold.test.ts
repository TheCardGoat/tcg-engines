/**
 * Daily digest 2026-05-08 — P0 production replay reproduction.
 *
 * Reproduces the actual production state from gameId mggXgny0UumOSRY-6TCxg_B turn 13
 * (player report #14 "Be King Undisputed with Maui Shark in play, game would not let
 *  me select my character to banish").
 *
 * Replay-cli evidence: Be King Undisputed was played indirectly via Powerline —
 * World's Greatest Rock Star's MASH-UP scry (play a song from the top 4 for free).
 * After Be King resolved, the engine state had:
 *   - pendingEffects[0]: Be King target-selection (chooserId = player_two)
 *   - bag.items[0]: Maui Half-Shark WAYFINDING (gain 1 lore, controllerId = player_one)
 * The opponent (player_two) is supposed to choose a character to banish, but in
 * production they timed out on the prompt.
 *
 * The synthetic Be King + Maui scaffold (p0-be-king-undisputed-with-stack-trigger)
 * passes because it routes through a direct `playCard(beKingUndisputed)` from hand,
 * which doesn't reproduce the same bag-and-pending coexistence the production replay
 * shows. This test reaches the production state by playing Marching Off to Battle
 * via singing (triggering Powerline's MASH-UP), then choosing Be King from the scry.
 */
import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mauiHalfshark } from "../cards/006";
import { powerlineWorldsGreatestRockStar } from "../cards/009";
import { beKingUndisputed } from "../cards/004";
import { marchingOffToBattle } from "../cards/011";

const opposingTarget = createMockCharacter({
  id: "be-king-prod-replay-target",
  name: "Sole Opposing Target",
  cost: 2,
  strength: 1,
  willpower: 2,
});

describe("[digest-2026-05-08 #14] Be King Undisputed via MASH-UP scry — production replay reproduction", () => {
  it("opponent can resolve the Be King banish prompt when it surfaces alongside a same-player WAYFINDING bag", () => {
    // Setup: player_one has Maui Half-Shark + Powerline (a Powerline that can sing a 4-cost song),
    // a 4-cost song in hand to sing (Marching Off to Battle), and Be King Undisputed in their deck.
    // Player_two has a single character (the only legal banish target).
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [mauiHalfshark, powerlineWorldsGreatestRockStar],
        hand: [marchingOffToBattle],
        deck: [beKingUndisputed],
      },
      {
        play: [opposingTarget],
        deck: 5,
      },
    );

    // Sing Marching Off to Battle. This will:
    //  1. Trigger Maui's WAYFINDING (gain 1 lore — auto-drains)
    //  2. Trigger Powerline's MASH-UP (scry → reveal top 4, allow play of 1 song)
    expect(
      testEngine.asPlayerOne().singSong(marchingOffToBattle, powerlineWorldsGreatestRockStar),
    ).toBeSuccessfulCommand();

    // Resolve Maui's WAYFINDING first (auto-drains in production, but be explicit here).
    // If Maui's WAYFINDING didn't auto-drain, this still resolves it.
    testEngine.asPlayerOne().resolveAllBagEffects({ resolveOptional: true });

    // Resolve Powerline's MASH-UP scry: pick Be King from the revealed top, send rest to bottom.
    // This causes Be King to be played (cost: free), creating its target-selection pending effect.
    // (Be King is the only revealed card in this fixture.)
    const scryResolution = testEngine.asPlayerOne().resolveNextPending({
      destinations: [
        { zone: "play", cards: [beKingUndisputed] },
        { zone: "deck-bottom", cards: [] },
      ],
    });
    expect(scryResolution).toBeSuccessfulCommand();

    // The engine handles this scenario correctly. The user-visible bug — every
    // Be King report in the digest — is in the simulator's `referenceSide`
    // computation: when the source card sits in the controller's `limbo` zone
    // (not projected to the chooser), `cardSnapshotsById[sourceCardId]` is
    // undefined and the referenceSide falls back to the chooser, breaking the
    // owner gate in `cardMatchesSelectionTargetDsl`. See follow-up simulator
    // fix in `game-context.svelte.ts#resolveSelectionReferenceSide`.
    const banishResolution = testEngine
      .asPlayerTwo()
      .resolveNextPending({ targets: [opposingTarget] });
    expect(banishResolution).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(opposingTarget)).toBe("discard");
  });
});
