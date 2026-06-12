import { beforeAll, describe, expect, it } from "vite-plus/test";
import "../testing/matchers.d.ts";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  createMockUnit,
  type GigFixtureEntry,
  type PlayerFixture,
  type TestEngineOptions,
  registerMatchers,
} from "../testing/index.ts";
import { evaluateCondition } from "../effects/target-resolver.ts";
import type { PlayerId } from "../types/branded.ts";

beforeAll(() => {
  registerMatchers();
});

/**
 * Win-condition tests, anchored to the official gameplay guide
 * (https://cyberpunktcg.com/gameplay-guide):
 *
 *   "If a player has at least seven Gig Dice in their Gig Area when they start
 *    their turn, they win the game."
 *
 *   "If both players complete a turn without taking a new Gig from their
 *    fixer area, the game goes into OVERTIME. In overtime, the moment you
 *    have the majority of Gig Dice, you win."
 *
 * The check fires at the *start of a turn* — before the active player draws,
 * gains a gig, or readies. Crossing seven mid-turn (e.g. by stealing) does not
 * end the game on the spot; the holder must survive the rival's turn and
 * re-enter their own turn with 7+ gigs still on the board.
 */

const ALL_DIE_TYPES = ["d4", "d6", "d8", "d10", "d12", "d20"] as const;

/** Build N gigArea fixture entries (smallest dice first, d20 last). */
function gigs(count: number): GigFixtureEntry[] {
  return ALL_DIE_TYPES.slice(0, count).map((dieType) => ({
    dieType,
    faceValue: 1,
  }));
}

function gig(dieType: (typeof ALL_DIE_TYPES)[number], source?: "self" | "rival"): GigFixtureEntry {
  return {
    dieType,
    faceValue: 1,
    source,
  };
}

function playerWithGigs(count: number, fixture?: PlayerFixture): PlayerFixture {
  return {
    deck: 40,
    gigArea: gigs(count),
    ...fixture,
  };
}

function engineWithGigs(
  p1Gigs: number,
  p2Gigs: number,
  opts?: TestEngineOptions,
): CyberpunkTestEngine {
  return CyberpunkTestEngine.createWithFixture(
    playerWithGigs(p1Gigs),
    playerWithGigs(p2Gigs),
    opts,
  );
}

function attackRivalAndSteal(
  engine: CyberpunkTestEngine,
  attacker: ReturnType<typeof createMockUnit>,
  as: PlayerId,
): void {
  engine.attackRival(attacker, { as });
  engine.resolveFullSteal({ as });
}

describe("win conditions", () => {
  describe("gig victory — start your turn with 7+ gigs", () => {
    it("ends the game in p1's favor when p1 begins their next turn already holding 7 gigs", () => {
      // p1 has 6 own gigs and steals p2's only gig. Their fixer is empty.
      // End p1's turn, let p2 take a turn, then p1's turn begins again —
      // at which point the start-of-turn check should fire.
      const runner = createMockUnit({ id: "gig-victory-runner", name: "Runner" });
      const engine = CyberpunkTestEngine.createWithFixture(
        playerWithGigs(6, { field: [runner] }),
        playerWithGigs(1),
      );

      expect(engine.isGameOver()).toBe(false);

      attackRivalAndSteal(engine, runner, P1); // p1 now has 7
      engine.passPhase({ as: P1 }); // p1 ends turn at 7

      engine.completeTurn({ as: P2 }); // p2 → p1 (start-of-turn check)

      expect(engine.isGameOver()).toBe(true);
      expect(engine.getWinnerId()).toBe(P1);
      expect(engine.getWinReason()).toBe("gig_victory");
    });

    it("does not end the game the moment a player reaches 6 gigs by gaining their start-of-turn die", () => {
      // p1 begins with 5 gigs and only the d20 remaining in their fixer.
      // When p2 ends the next turn, p1's turn begins: the start-of-turn
      // check sees only 5 gigs (no win), and only then does p1 gain the
      // d20 to reach 6. The game must NOT end mid-turn (threshold is 7).
      const engine = engineWithGigs(5, 0);

      engine.completeTurn(); // p1 ends with 5 gigs
      // During p2's turn-start, the auto-gain-gig harness resolves p2's
      // pending choice. p1's 6th gig is gained when p1's turn 3 begins.
      engine.completeTurn(); // p2 ends → p1's turn begins; p1 auto-gains d20

      expect(engine.getGigCount(P1)).toBe(6);
      // Reaching 6 mid-turn should not end the game on the spot.
      expect(engine.isGameOver()).toBe(false);
    });

    it("does end the game one turn cycle later, after p1 survives p2's turn with 7 gigs", () => {
      // p1 begins with 6 own gigs and a runner, p2 has 1 gig.
      // p1 steals to reach 7. No win mid-turn. p1 ends turn, p2 takes a
      // turn, then p1's next turn begins with 7 → start-of-turn win.
      const runner = createMockUnit({ id: "gig-victory-runner", name: "Runner" });
      const engine = CyberpunkTestEngine.createWithFixture(
        playerWithGigs(6, { field: [runner] }),
        playerWithGigs(1),
      );

      attackRivalAndSteal(engine, runner, P1); // p1 reaches 7
      expect(engine.isGameOver()).toBe(false);

      engine.passPhase({ as: P1 }); // p1 ends turn at 7
      engine.completeTurn({ as: P2 }); // p2 → p1 (start-of-turn check)

      expect(engine.isGameOver()).toBe(true);
      expect(engine.getWinnerId()).toBe(P1);
      expect(engine.getWinReason()).toBe("gig_victory");
    });

    it("does not declare a winner when a player starts their turn with only 5 gigs", () => {
      const engine = engineWithGigs(5, 0);
      engine.completeTurn();
      engine.completeTurn();

      // p1 starts turn 3 with 5 gigs — no gig_victory fires before gaining.
      // (After gaining d20 they'd be at 6, but that's mid-turn.)
      expect(engine.getWinReason()).not.toBe("gig_victory");
    });

    it("does not end the game mid-turn when a player reaches 7 gigs by stealing", () => {
      // p1 crosses from 6 to 7 by resolving a direct attack and stealing one
      // of p2's gigs. The win check should still wait until p1's next turn.
      const runner = createMockUnit({ id: "gig-victory-runner", name: "Gig Victory Runner" });
      const engine = CyberpunkTestEngine.createWithFixture(
        playerWithGigs(6, { field: [runner] }),
        playerWithGigs(1),
      );

      attackRivalAndSteal(engine, runner, P1);

      expect(engine.getGigCount(P1)).toBe(7);
      expect(engine.isGameOver()).toBe(false);

      engine.passPhase({ as: P1 }); // p1 ends turn at 7 gigs — game still on
      expect(engine.isGameOver()).toBe(false);

      engine.completeTurn({ as: P2 }); // p2 ends → p1's next turn begins → win fires
      expect(engine.isGameOver()).toBe(true);
      expect(engine.getWinnerId()).toBe(P1);
      expect(engine.getWinReason()).toBe("gig_victory");
    });
  });

  describe("overtime — begins after the last player's 7th turn (turn 15)", () => {
    it("does not activate overtime before turn 15", () => {
      const engine = engineWithGigs(3, 3);

      // Pass 12 turns → turn 13 begins (first player's 7th turn).
      for (let i = 0; i < 12; i++) {
        engine.completeTurn();
      }

      expect(engine.getState().G.turnMetadata.overtimeActive).toBe(false);
      expect(engine.isGameOver()).toBe(false);
    });

    it("activates overtime at the start of turn 15", () => {
      const engine = engineWithGigs(3, 3);

      // Pass 14 turns → turn 15 begins (after last player's 7th turn).
      for (let i = 0; i < 14; i++) {
        engine.completeTurn();
      }

      expect(engine.getState().G.turnMetadata.overtimeActive).toBe(true);
      expect(engine.isGameOver()).toBe(false);
    });

    it("ends the game immediately when a player has the gig majority as overtime begins", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        playerWithGigs(6, {
          gigArea: [...gigs(7), gig("d4", "rival")],
        }),
        playerWithGigs(5, {
          gigArea: [gig("d6"), gig("d8"), gig("d10"), gig("d12"), gig("d20")],
        }),
      );

      engine.judgeSetTurnMetadata({ turnNumber: 14 });

      // Turn 14 ends → turn 15 begins, overtime activates, majority = 7.
      // P1 has 7 gigs → wins immediately.
      engine.completeTurn();

      expect(engine.isGameOver()).toBe(true);
      expect(engine.getWinnerId()).toBe(P1);
      expect(engine.getWinReason()).toBe("overtime_majority");
    });

    it("exposes overtime as a card condition", () => {
      const preOvertimeEngine = engineWithGigs(3, 3);
      const sourceCard = preOvertimeEngine.getCardsInZone("legendArea", P1)[0];
      if (!sourceCard) throw new Error("Expected a source card");

      const ctx = {
        state: preOvertimeEngine.getState(),
        sourceCardId: sourceCard.instanceId,
        sourcePlayerId: P1,
        abilityIndex: 0,
        contextTargets: {},
        boundTargets: {},
      };

      expect(evaluateCondition({ condition: "overtime" }, ctx)).toBe(false);

      const overtimeEngine = CyberpunkTestEngine.createWithFixture(
        { gigArea: gigs(3) },
        { gigArea: gigs(3) },
        { overtime: true },
      );
      const overtimeSourceCard = overtimeEngine.getCardsInZone("legendArea", P1)[0];
      if (!overtimeSourceCard) throw new Error("Expected an overtime source card");
      const overtimeCtx = {
        ...ctx,
        state: overtimeEngine.getState(),
        sourceCardId: overtimeSourceCard.instanceId,
      };

      expect(evaluateCondition({ condition: "overtime" }, overtimeCtx)).toBe(true);
      expect(evaluateCondition({ condition: "overtime", active: false }, overtimeCtx)).toBe(false);
    });
  });

  describe("deck-out loss — running out of cards", () => {
    it("hands victory to the rival when the active player's deck empties", () => {
      // p1 begins with a tiny deck. After a couple of draws on subsequent
      // turn-starts, p1's deck reaches 0 — at which point the rival wins.
      const engine = CyberpunkTestEngine.createWithFixture({ deck: 1 }, { deck: 40 });

      // Drain p1's deck by playing through enough turns that they draw it
      // dry. Two turns is enough: turn 1's start-of-turn draw was already
      // performed during setup, so a single additional p1 turn-start will
      // drop the deck to 0.
      engine.completeTurn(); // p1 → p2
      engine.completeTurn(); // p2 → p1 (start of turn drew last card)

      expect(engine.isGameOver()).toBe(true);
      expect(engine.getWinnerId()).toBe(P2);
      expect(engine.getWinReason()).toBe("deck_out_victory");
    });
  });
});
