/**
 * Walk a fresh game from setup through two full turns per player, anchoring
 * each phase to the rules text from the gameplay guide.
 *
 * SETUP (per the guide):
 *   - SHUFFLE & PLACE: Legends face-down random; main deck shuffled; gig dice
 *     in fixer area.
 *   - CHOOSE PLAY ORDER: d20 roll decides; first player spends two of
 *     their Legends before starting their first turn.
 *   - DRAW: Each player draws 6 cards.
 *   - MULLIGAN CHANCE: Optional, once.
 *
 * START PHASE (every turn, in order):
 *   1. READY SPENT CARDS (skipped on turn 1)
 *   2. DRAW A CARD
 *   3. GAIN A GIG (any die except d20, which must be last)
 *
 * First player's turn 1 carve-out:
 *   The Beta rules specify that readying is skipped on the first player's
 *   turn 1 to preserve the setup handicap: the first player begins with two
 *   of their Legends spent. Steps 2 (draw) and 3 (gain a gig) still fire.
 */
import { beforeAll, describe, expect, it } from "vite-plus/test";
import "../../src/testing/matchers.d.ts";
import { CyberpunkTestEngine, registerMatchers } from "../../src/testing/index.ts";
import type { PlayerId } from "../../src/types/branded.ts";

beforeAll(() => {
  registerMatchers();
});

describe("Flow — two turns per player from a fresh game", () => {
  it("walks the full sequence from setup through 4 half-turns", () => {
    // autoGainGig: false — exercise the rules-faithful "GAIN A GIG is a
    // player choice" flow. Each turn, the active player must call gainGig()
    // with their chosen die.
    const engine = CyberpunkTestEngine.createWithFixture(
      {},
      {},
      { skipSetup: false, seed: "two-turns-flow", autoGainGig: false },
    );

    const first: PlayerId = engine.getActivePlayerId();
    const second: PlayerId = engine.getOpponentOf(first);

    // Helper: pick the lowest-d-type non-d20 die for the active player.
    const pickFirstAllowedDie = (pid: PlayerId): string => {
      const choice = engine.getPrompt(pid).choice;
      if (!choice || choice.type !== "gainGig") {
        throw new Error(`No gainGig pending choice for ${pid as string}`);
      }
      return choice.payload.allowedDieIds[0]!;
    };

    // ── SETUP — initial state ────────────────────────────────────────────
    // SHUFFLE & PLACE + DRAW: 6-card opening hand, 6 fixer dice, 0 gigs.
    expect(engine.getPhase()).toBe("setup");
    expect(engine.getTurnNumber()).toBe(1);
    expect(engine.getCardsInZone("hand", first)).toHaveLength(6);
    expect(engine.getCardsInZone("hand", second)).toHaveLength(6);
    expect(engine.getFixerDice(first)).toHaveLength(6);
    expect(engine.getFixerDice(second)).toHaveLength(6);
    expect(engine.getGigCount(first)).toBe(0);
    expect(engine.getGigCount(second)).toBe(0);
    // CHOOSE PLAY ORDER: first player has 2 spent legends, rival has 0.
    expect(engine.getSpentLegends(first)).toHaveLength(2);
    expect(engine.getSpentLegends(second)).toHaveLength(0);

    // ── MULLIGAN CHANCE — both players take the optional mulligan ────────
    engine.mulligan({ as: first });
    expect(engine.isMulliganDone(first)).toBe(true);
    expect(engine.isMulliganDone(second)).toBe(false);
    expect(engine.getPhase()).toBe("setup"); // still in setup; rival hasn't decided

    engine.mulligan({ as: second });
    expect(engine.isMulliganDone(second)).toBe(true);
    // Both decided → engine auto-advances to start phase for the first player.
    // Step 1 (READY) is skipped on turn 1; step 2 (DRAW) fires immediately;
    // step 3 (GAIN A GIG) opens a pending choice the player resolves with `gainGig`.
    expect(engine.getPhase()).toBe("start");
    expect(engine.getActivePlayerId()).toBe(first);
    expect(engine.getTurnNumber()).toBe(1);

    // ── TURN 1 (first player) — START PHASE ──────────────────────────────
    // Step 1: READY SPENT CARDS → SKIPPED on first player's turn 1; the two
    // pre-spent legends stay spent.
    expect(engine.getSpentLegends(first)).toHaveLength(2);
    // Step 2: DRAW A CARD → hand 6 + 1 = 7.
    expect(engine.getCardsInZone("hand", first)).toHaveLength(7);
    // Step 3: GAIN A GIG — pending choice is open. Fixer still has 6 dice
    // and gig area is empty until the player picks.
    expect(engine.getFixerDice(first)).toHaveLength(6);
    expect(engine.getGigCount(first)).toBe(0);
    {
      const choice = engine.getPrompt(first).choice;
      expect(choice?.type).toBe("gainGig");
      // d20 must be taken last → it isn't in the allowed list yet.
      const allowedTypes = (
        choice as { payload: { allowedDieIds: string[] } }
      ).payload.allowedDieIds.map((id) => engine.getState().G.gigDice[id]!.dieType);
      expect(allowedTypes).not.toContain("d20");
      expect(allowedTypes).toHaveLength(5);
    }
    // Player resolves: takes one die.
    engine.gainGig(pickFirstAllowedDie(first), { as: first });
    expect(engine.getFixerDice(first)).toHaveLength(5);
    expect(engine.getGigCount(first)).toBe(1);
    expect(engine.getPrompt(first).choice).toBeNull();

    // Eddies still 0 — first player hasn't sold or spent anything yet.
    expect(engine.getEddies(first)).toBe(0);
    // Second player's state untouched until their first turn begins.
    expect(engine.getCardsInZone("hand", second)).toHaveLength(6);
    expect(engine.getFixerDice(second)).toHaveLength(6);
    expect(engine.getGigCount(second)).toBe(0);

    // MAIN PHASE → end of turn.
    engine.passPhase({ as: first });

    // ── TURN 1 (second player) — START PHASE (full, all 3 steps) ─────────
    expect(engine.getActivePlayerId()).toBe(second);
    expect(engine.getTurnNumber()).toBe(2);
    expect(engine.getPhase()).toBe("start");
    // Step 1: READY SPENT CARDS → second player had nothing spent.
    expect(engine.getSpentLegends(second)).toHaveLength(0);
    // Step 2: DRAW → 6 + 1 = 7.
    expect(engine.getCardsInZone("hand", second)).toHaveLength(7);
    // Step 3: GAIN A GIG — pending choice opens for second player.
    engine.gainGig(pickFirstAllowedDie(second), { as: second });
    expect(engine.getFixerDice(second)).toHaveLength(5);
    expect(engine.getGigCount(second)).toBe(1);

    engine.passPhase({ as: second });

    // ── TURN 2 (first player) — START PHASE (full, all 3 steps) ──────────
    expect(engine.getActivePlayerId()).toBe(first);
    expect(engine.getTurnNumber()).toBe(3);
    expect(engine.getPhase()).toBe("start");
    // Step 1: READY → the two pre-spent legends finally ready up.
    expect(engine.getSpentLegends(first)).toHaveLength(0);
    // Step 2: DRAW → 7 + 1 = 8.
    expect(engine.getCardsInZone("hand", first)).toHaveLength(8);
    // Step 3: GAIN A GIG.
    engine.gainGig(pickFirstAllowedDie(first), { as: first });
    expect(engine.getFixerDice(first)).toHaveLength(4);
    expect(engine.getGigCount(first)).toBe(2);

    engine.passPhase({ as: first });

    // ── TURN 2 (second player) — START PHASE ─────────────────────────────
    expect(engine.getActivePlayerId()).toBe(second);
    expect(engine.getTurnNumber()).toBe(4);
    expect(engine.getPhase()).toBe("start");
    // Step 1: READY → second player had nothing spent.
    expect(engine.getSpentLegends(second)).toHaveLength(0);
    // Step 2: DRAW → 7 + 1 = 8.
    expect(engine.getCardsInZone("hand", second)).toHaveLength(8);
    // Step 3: GAIN A GIG.
    engine.gainGig(pickFirstAllowedDie(second), { as: second });
    expect(engine.getFixerDice(second)).toHaveLength(4);
    expect(engine.getGigCount(second)).toBe(2);

    engine.passPhase({ as: second });

    // ── End state — turn 5 about to start (first player) ─────────────────
    // After P2 ends turn 4, P1's turn 5 start phase has fired DRAW + opened
    // the pending choice; the player hasn't picked yet, so fixer/gig haven't
    // ticked over for that turn.
    expect(engine.getTurnNumber()).toBe(5);
    expect(engine.getActivePlayerId()).toBe(first);
    // First player had 2 completed start phases (turns 1, 3) + drew on turn
    // 5 → hand 6 + 3 = 9. Fixer/gig reflect 2 takes (turns 1, 3); the
    // turn-5 take is still pending.
    expect(engine.getCardsInZone("hand", first)).toHaveLength(9);
    expect(engine.getFixerDice(first)).toHaveLength(4);
    expect(engine.getGigCount(first)).toBe(2);
    expect(engine.getPrompt(first).choice?.type).toBe("gainGig");
    // Second player had 2 start phases (turns 2, 4): hand 8, fixer 4, gig 2.
    expect(engine.getCardsInZone("hand", second)).toHaveLength(8);
    expect(engine.getFixerDice(second)).toHaveLength(4);
    expect(engine.getGigCount(second)).toBe(2);

    // GAIN A GIG always rolls the die — face values must be non-zero.
    for (const pid of [first, second]) {
      for (const die of engine.getGigDice(pid)) {
        expect(die.faceValue).toBeGreaterThan(0);
        expect(die.location).toBe("gigArea");
      }
    }

    expect(engine.isGameOver()).toBe(false);
  });
});
