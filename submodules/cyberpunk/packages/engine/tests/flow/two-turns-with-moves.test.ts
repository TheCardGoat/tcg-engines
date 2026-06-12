/**
 * Two turns per player with concrete moves played each turn. Validates the
 * engine against the rules text from the gameplay guide:
 *
 *   MAIN PHASE — actions allowed in any order:
 *     - SELL FOR EDDIES: once per turn; reveal a card with the Sell Tag (€$),
 *       place face-down in the Eddies area.
 *     - CALL A LEGEND: once per turn; spend 1 Eddie to flip one face-down
 *       Legend face-up.
 *     - PLAY CARDS: spend Eddies equal to printed cost; Units enter with Lag
 *       and can't attack or self-spend on the turn they're played.
 *
 * First player's turn 1 carve-out:
 *   See `two-turns.test.ts` for the full rationale. Steps 1 (DRAW) and 2
 *   (GAIN A GIG) of the start phase fire on turn 1 as the rules direct.
 *   Step 3 (READY SPENT CARDS) is skipped to preserve setup's "first player
 *   starts with two of their Legends spent" handicap.
 *
 * Both players use `keepHand` instead of `mulligan` — mulligan reshuffles the
 * hand back into the deck and redraws 6 random cards, scrambling the
 * deterministic mock-card fixture this test relies on. Keeping is legal per
 * the gameplay guide ("MULLIGAN CHANCE: If you want, you can …").
 */
import { beforeAll, describe, expect, it } from "vite-plus/test";
import "../../src/testing/matchers.d.ts";
import {
  CyberpunkTestEngine,
  P1,
  createMockLegend,
  createMockUnit,
  registerMatchers,
} from "../../src/testing/index.ts";
import type { PlayerId } from "../../src/types/branded.ts";

beforeAll(() => {
  registerMatchers();
});

describe("Flow — two turns per player with moves", () => {
  it("plays sell, play, and call-legend across four half-turns", () => {
    // Symmetric per-player fixture: each side gets one cheap unit (cost 1)
    // and one sellable filler (cost 4, has sell tag). Pre-funded with 5
    // eddies — spending sold-card eddies is a separate concern.
    const p1Cheap = createMockUnit({ id: "p1_cheap", name: "P1 Striker", cost: 1, power: 3 });
    const p1Sellable = createMockUnit({
      id: "p1_sell",
      name: "P1 Filler",
      cost: 4,
      power: 2,
      hasSellTag: true,
    });
    const p2Cheap = createMockUnit({ id: "p2_cheap", name: "P2 Striker", cost: 1, power: 3 });
    const p2Sellable = createMockUnit({
      id: "p2_sell",
      name: "P2 Filler",
      cost: 4,
      power: 2,
      hasSellTag: true,
    });

    // Mock legends (no abilities) so call-legend doesn't trigger a random
    // FLIP effect from the real catalog and leave a pending choice.
    const mockLegends = (prefix: string) => [
      createMockLegend({ id: `${prefix}_legend_1`, name: `${prefix} Legend 1` }),
      createMockLegend({ id: `${prefix}_legend_2`, name: `${prefix} Legend 2` }),
      createMockLegend({ id: `${prefix}_legend_3`, name: `${prefix} Legend 3` }),
    ];

    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [p1Cheap, p1Sellable],
        legendArea: mockLegends("p1"),
        eddies: 5,
      },
      {
        hand: [p2Cheap, p2Sellable],
        legendArea: mockLegends("p2"),
        eddies: 5,
      },
      { skipSetup: false, seed: "two-turns-with-moves", autoGainGig: false },
    );

    const first: PlayerId = engine.getActivePlayerId();
    const second: PlayerId = engine.getOpponentOf(first);
    const cheap = first === P1 ? p1Cheap : p2Cheap;
    const sellable = first === P1 ? p1Sellable : p2Sellable;
    const rivalCheap = first === P1 ? p2Cheap : p1Cheap;
    const rivalSellable = first === P1 ? p2Sellable : p1Sellable;

    const pickFirstAllowedDie = (pid: PlayerId): string => {
      const choice = engine.getPrompt(pid).choice;
      if (!choice || choice.type !== "gainGig") {
        throw new Error(`No gainGig pending choice for ${pid as string}`);
      }
      return choice.payload.allowedDieIds[0]!;
    };

    // ── SETUP — fixture sanity check ─────────────────────────────────────
    expect(engine.getPhase()).toBe("setup");
    expect(engine.getCardsInZone("hand", first)).toHaveLength(2);
    expect(engine.getCardsInZone("hand", second)).toHaveLength(2);
    expect(engine.getEddies(first)).toBe(5);
    expect(engine.getEddies(second)).toBe(5);
    expect(engine.getSpentLegends(first)).toHaveLength(2);

    // MULLIGAN CHANCE — both players keep. Engine auto-advances to play.
    engine.keepHand({ as: first });
    expect(engine.getPhase()).toBe("setup");
    engine.keepHand({ as: second });
    expect(engine.getPhase()).toBe("start");
    expect(engine.getActivePlayerId()).toBe(first);

    // ── TURN 1 (first player) — START PHASE ──────────────────────────────
    // Step 1: READY SPENT CARDS → skipped on first player's turn 1.
    expect(engine.getSpentLegends(first)).toHaveLength(2);
    // Step 2: DRAW → 2 + 1 = 3.
    expect(engine.getCardsInZone("hand", first)).toHaveLength(3);
    // Step 3: GAIN A GIG — pending choice opens; player picks a non-d20 die.
    engine.gainGig(pickFirstAllowedDie(first), { as: first });
    expect(engine.getFixerDice(first)).toHaveLength(5);
    expect(engine.getGigCount(first)).toBe(1);

    // ── TURN 1 (first player) — MAIN PHASE ───────────────────────────────
    // SELL FOR EDDIES: reveal sellable, place face-down in eddieArea.
    engine.sellCard(sellable, { as: first });
    expect(engine.getCardsInZone("eddieArea", first)).toHaveLength(1);
    expect(engine.getCardsInZone("hand", first)).toHaveLength(2);

    // PLAY CARDS: spend 1 eddie, place unit on field, summoning-sick.
    engine.playCard(cheap, { as: first });
    expect(engine.getEddies(first)).toBe(5);
    expect(engine.getCardsInZone("field", first)).toHaveLength(1);
    expect(engine.getCardsInZone("hand", first)).toHaveLength(1);
    const playedUnit = engine.getCard(cheap, "field", first);
    expect(playedUnit.meta.playedThisTurn).toBe(true);

    // CALL A LEGEND: spend 1 eddie, flip one face-down legend face-up.
    // All 3 legends start face-down (spent and face-down are independent).
    expect(engine.getFaceDownLegends(first)).toHaveLength(3);
    engine.callLegend(engine.getFaceDownLegends(first)[0]!, { as: first });
    expect(engine.getEddies(first)).toBe(4);
    expect(engine.getFaceDownLegends(first)).toHaveLength(2);

    // ── TURN 1 (first player) — end of turn ──────────────────────────────
    engine.passPhase({ as: first });

    // ── TURN 1 (second player) — START PHASE (full, all 3 steps) ─────────
    expect(engine.getActivePlayerId()).toBe(second);
    expect(engine.getPhase()).toBe("start");
    // Step 1: READY → nothing to ready.
    // Step 2: DRAW → 2 + 1 = 3.
    expect(engine.getCardsInZone("hand", second)).toHaveLength(3);
    // Step 3: GAIN A GIG.
    engine.gainGig(pickFirstAllowedDie(second), { as: second });
    expect(engine.getFixerDice(second)).toHaveLength(5);
    expect(engine.getGigCount(second)).toBe(1);

    // MAIN PHASE: sell, play.
    engine.sellCard(rivalSellable, { as: second });
    engine.playCard(rivalCheap, { as: second });
    expect(engine.getEddies(second)).toBe(5);
    expect(engine.getCardsInZone("field", second)).toHaveLength(1);

    engine.passPhase({ as: second });

    // ── TURN 2 (first player) — START PHASE (full, all 3 steps) ──────────
    expect(engine.getActivePlayerId()).toBe(first);
    expect(engine.getPhase()).toBe("start");
    // Step 1: READY → playedThisTurn cleared on the played unit, the two
    // pre-spent legends finally ready up.
    const firstUnit = engine.getCard(cheap, "field", first);
    expect(firstUnit.meta.playedThisTurn).toBe(false);
    expect(firstUnit).toBeReady();
    expect(engine.getSpentLegends(first)).toHaveLength(0);
    // Step 2: DRAW → 1 + 1 = 2.
    expect(engine.getCardsInZone("hand", first)).toHaveLength(2);
    // Step 3: GAIN A GIG.
    engine.gainGig(pickFirstAllowedDie(first), { as: first });
    expect(engine.getFixerDice(first)).toHaveLength(4);
    expect(engine.getGigCount(first)).toBe(2);

    // soldThisTurn cleared too — first player can sell again this turn if
    // they had another sellable card.

    engine.passPhase({ as: first });

    // ── TURN 2 (second player) — START PHASE ─────────────────────────────
    expect(engine.getActivePlayerId()).toBe(second);
    expect(engine.getPhase()).toBe("start");
    // Step 1: READY → playedThisTurn cleared.
    const secondUnit = engine.getCard(rivalCheap, "field", second);
    expect(secondUnit).toBeReady();
    expect(secondUnit.meta.playedThisTurn).toBe(false);
    // Step 2: DRAW → 1 + 1 = 2 (P2 entered with 1 after sell + play in T1).
    expect(engine.getCardsInZone("hand", second)).toHaveLength(2);
    // Step 3: GAIN A GIG.
    engine.gainGig(pickFirstAllowedDie(second), { as: second });
    expect(engine.getFixerDice(second)).toHaveLength(4);
    expect(engine.getGigCount(second)).toBe(2);

    engine.passPhase({ as: second });
    // First player's next turn has begun; their gainGig pending choice is
    // open but the test doesn't need to resolve it.
    expect(engine.getPrompt(first).choice?.type).toBe("gainGig");

    // ── End state — two full turns each ──────────────────────────────────
    expect(engine.getActivePlayerId()).toBe(first);
    expect(engine.getCardsInZone("field", first)).toHaveLength(1);
    expect(engine.getCardsInZone("field", second)).toHaveLength(1);
    expect(engine.getCardsInZone("eddieArea", first)).toHaveLength(1);
    expect(engine.getCardsInZone("eddieArea", second)).toHaveLength(1);
    expect(engine.isGameOver()).toBe(false);
  });
});
