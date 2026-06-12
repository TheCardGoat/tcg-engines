/**
 * Setup Flow — TDD test suite
 *
 * Verifies that the Gundam TCG setup sequence (rules 6-2-1 through 6-2-4)
 * is correctly implemented in gundamFlow / setup moves.
 *
 * Milestones (all checked sequentially in the happy-path test):
 *  1. Resource deck filled to 10 cards (each player)
 *  2. First player is chosen
 *  3. Both players draw their initial hand of 5 cards
 *  4. Alter-hand (mulligan) works correctly
 *  5. Shield area is filled with the 6 top cards from each player's deck
 *  6. EX Base token is placed in the battle area (base zone) for each player
 *  7. Player Two receives one EX Resource token in their resource area
 */

import { describe, it, expect } from "vite-plus/test";
import "../../testing/register-matchers.ts";
import { GundamTestEngine, PLAYER_ONE, PLAYER_TWO } from "../../../index.ts";
import { asPlayerId } from "../../../index.ts";

// Each player needs at least 12 main deck cards (5 for hand + 6 for shields + 1 for first turn draw)
const MAIN_DECK_SIZE = 12;
const RESOURCE_DECK_SIZE = 10;
const INITIAL_HAND_SIZE = 5;
const SHIELD_SIZE = 6;

function createSetupEngine() {
  return GundamTestEngine.create(
    { deck: MAIN_DECK_SIZE, resourceDeck: RESOURCE_DECK_SIZE },
    { deck: MAIN_DECK_SIZE, resourceDeck: RESOURCE_DECK_SIZE },
    { skipToMainPhase: false },
  );
}

// ── Happy path ─────────────────────────────────────────────────────────────────

describe("Gundam TCG Setup Flow (rules 6-2-1 through 6-2-4)", () => {
  it("completes all setup milestones in sequence on a single engine instance", () => {
    const engine = createSetupEngine();

    // ── Milestone 1: resource decks filled (6-2-1-3) ──────────────────────────
    expect(engine).toHaveCardCountInZone(
      { zone: "resourceDeck", playerId: PLAYER_ONE },
      RESOURCE_DECK_SIZE,
    );
    expect(engine).toHaveCardCountInZone(
      { zone: "resourceDeck", playerId: PLAYER_TWO },
      RESOURCE_DECK_SIZE,
    );

    // ── Milestone 2: first player chosen (6-2-1-4) ────────────────────────────
    expect(engine).toBeInPhase("choose-first-player");

    engine.doMove("chooseFirstPlayer", asPlayerId(PLAYER_ONE), { playerId: PLAYER_ONE });

    expect(engine.getState().ctx.status.turnPlayer).toBe(PLAYER_ONE);

    // ── Milestone 3: initial hands drawn (6-2-1-5) ────────────────────────────
    // onEnter for the mulligan phase draws 5 cards for each player automatically
    expect(engine).toHaveCardCountInZone({ zone: "hand", playerId: PLAYER_ONE }, INITIAL_HAND_SIZE);
    expect(engine).toHaveCardCountInZone({ zone: "hand", playerId: PLAYER_TWO }, INITIAL_HAND_SIZE);

    // ── Milestone 4: alter hand — both players pass (keep starting hand) ──────
    expect(engine).toBeInPhase("mulligan");

    engine.doMove("alterHand", asPlayerId(PLAYER_ONE), { wantsRedraw: false });

    // Only P1 has decided; P2 still pending — still in mulligan phase
    expect(engine).toBeInPhase("mulligan");
    expect(engine).toHaveCardCountInZone({ zone: "hand", playerId: PLAYER_ONE }, INITIAL_HAND_SIZE);

    engine.doMove("alterHand", asPlayerId(PLAYER_TWO), { wantsRedraw: false });

    expect(engine).toHaveCardCountInZone({ zone: "hand", playerId: PLAYER_TWO }, INITIAL_HAND_SIZE);

    // ── Milestone 5: shield areas filled with top 6 deck cards (6-2-2) ────────
    // onExit for the mulligan phase fills shields automatically
    expect(engine).toHaveCardCountInZone({ zone: "shieldArea", playerId: PLAYER_ONE }, SHIELD_SIZE);
    expect(engine).toHaveCardCountInZone({ zone: "shieldArea", playerId: PLAYER_TWO }, SHIELD_SIZE);

    // ── Milestone 6: EX Base token in base section for each player (6-2-3) ─────
    expect(engine).toHaveCardCountInZone({ zone: "baseSection", playerId: PLAYER_ONE }, 1);
    expect(engine).toHaveCardCountInZone({ zone: "baseSection", playerId: PLAYER_TWO }, 1);

    // ── Milestone 7: EX Resource token for Player Two only (6-2-4) ────────────
    // After setup, the game transitions to turnCycle and the start-phase/draw-phase/resource-phase
    // auto-advance, placing 1 resource from Player One's resource deck.
    // Player Two retains only the EX Resource token from setup rule 6-2-4.
    expect(engine).toHaveCardCountInZone({ zone: "resourceArea", playerId: PLAYER_ONE }, 1);
    expect(engine).toHaveCardCountInZone({ zone: "resourceArea", playerId: PLAYER_TWO }, 1);

    // ── Setup complete: game has transitioned to turnCycle ─────────────────────
    expect(engine).toBeInGameSegment("turnCycle");
  });

  // ── Mulligan variant ─────────────────────────────────────────────────────────

  it("allows a player to redraw their entire starting hand (6-2-1-6-1)", () => {
    const engine = createSetupEngine();

    engine.doMove("chooseFirstPlayer", asPlayerId(PLAYER_ONE), { playerId: PLAYER_ONE });

    // Capture the original hand and remaining deck before redraw
    const handBefore = engine.getCardsInZone({ zone: "hand", playerId: PLAYER_ONE });
    const deckBefore = engine.getCardsInZone({ zone: "deck", playerId: PLAYER_ONE });
    expect(engine).toHaveCardCountInZone({ zone: "hand", playerId: PLAYER_ONE }, INITIAL_HAND_SIZE);

    // Return all cards and redraw
    const result = engine.doMove("alterHand", asPlayerId(PLAYER_ONE), { wantsRedraw: true });

    expect(result.success).toBe(true);

    // A full mulligan preserves hand size and deck size overall.
    const handAfter = engine.getCardsInZone({ zone: "hand", playerId: PLAYER_ONE });
    const deckAfter = engine.getCardsInZone({ zone: "deck", playerId: PLAYER_ONE });
    expect(engine).toHaveCardCountInZone({ zone: "hand", playerId: PLAYER_ONE }, INITIAL_HAND_SIZE);
    expect(deckAfter.length).toBe(deckBefore.length);

    // The same cards should still exist across hand + deck after returning and redrawing.
    const cardsBefore = [...handBefore, ...deckBefore].sort();
    const cardsAfter = [...handAfter, ...deckAfter].sort();
    expect(cardsAfter).toEqual(cardsBefore);
  });

  // ── Unhappy paths ────────────────────────────────────────────────────────────
  //
  // doMove() throws on failure, so unhappy-path tests use executeCommand()
  // directly to capture the CommandResult without an exception.

  it("rejects chooseFirstPlayer with an invalid player ID", () => {
    const engine = createSetupEngine();
    const runtime = engine.getRuntime();

    const result = runtime.executeCommand(
      {
        commandID: "test-bad-player",
        move: "chooseFirstPlayer",
        prevStateID: runtime.state.ctx._stateID,
        actorRole: "player",
        args: { playerId: "not-a-real-player" },
      },
      asPlayerId(PLAYER_ONE),
    );

    expect(result.success).toBe(false);
    if (!result.success) expect(result.errorCode).toBe("INVALID_PLAYER");
  });

  it("rejects alterHand when a player tries to act out of turn (no priority)", () => {
    const engine = createSetupEngine();
    const runtime = engine.getRuntime();

    engine.doMove("chooseFirstPlayer", asPlayerId(PLAYER_ONE), { playerId: PLAYER_ONE });
    // P1 makes their mulligan decision — priority passes to P2
    engine.doMove("alterHand", asPlayerId(PLAYER_ONE), { wantsRedraw: false });

    // P1 tries to act again while P2 holds priority
    const result = runtime.executeCommand(
      {
        commandID: "test-double-mulligan",
        move: "alterHand",
        prevStateID: runtime.state.ctx._stateID,
        actorRole: "player",
        args: { wantsRedraw: false },
      },
      asPlayerId(PLAYER_ONE),
    );

    expect(result.success).toBe(false);
    // Active player check fires before the MULLIGAN_ALREADY_DONE guard — both are valid rejections
    if (!result.success)
      expect(["NOT_ACTIVE_PLAYER", "MULLIGAN_ALREADY_DONE"]).toContain(result.errorCode);
  });

  it("rejects alterHand when player has already completed mulligan", () => {
    const engine = createSetupEngine();
    const runtime = engine.getRuntime();

    engine.doMove("chooseFirstPlayer", asPlayerId(PLAYER_ONE), { playerId: PLAYER_ONE });
    engine.doMove("alterHand", asPlayerId(PLAYER_ONE), { wantsRedraw: false });
    engine.doMove("alterHand", asPlayerId(PLAYER_TWO), { wantsRedraw: false });

    // After both players complete mulligan, setup → turnCycle transition
    // fires, so trying to alterHand again is now an invalid-flow-position
    // rejection (we're no longer in the mulligan phase). The other codes
    // are kept as acceptable in case the flow changes make activePlayer /
    // mulligan-already-done fire first.
    const result = runtime.executeCommand(
      {
        commandID: "test-after-mulligan",
        move: "alterHand",
        prevStateID: runtime.state.ctx._stateID,
        actorRole: "player",
        args: { wantsRedraw: true },
      },
      asPlayerId(PLAYER_ONE),
    );

    expect(result.success).toBe(false);
    if (!result.success)
      expect(["INVALID_FLOW_POSITION", "NOT_ACTIVE_PLAYER", "MULLIGAN_ALREADY_DONE"]).toContain(
        result.errorCode,
      );
  });
});
