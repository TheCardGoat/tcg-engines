import { describe, expect, it } from "vite-plus/test";
import { alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../src/testing/index.ts";
import type { CardInstanceId, GigDieId, PlayerId } from "../src/types/branded.ts";

/**
 * Regression tests for the central pending-choice guard in processor.ts.
 *
 * When a player has an outstanding pending choice (gainGig, chooseGigsToSteal,
 * or any other), moves that do not declare `handlesPendingChoice: true` must be
 * rejected with PENDING_CHOICE_REQUIRED — including passPhase, resolveAttack,
 * and any other "advance" action.
 *
 * The test engine's autoGainGig helper and autoResolvePendingStealGigs suppress
 * this guard in most tests for convenience, so these tests explicitly bypass
 * those helpers to verify the raw engine behavior.
 */

// ── gainGig pending choice ─────────────────────────────────────────────

describe("gainGig pending choice", () => {
  function endP1Turn(engine: CyberpunkTestEngine) {
    const p1 = engine.getActivePlayerId();
    engine.passPhase({ as: p1 }); // end turn; P2 gets gainGig
  }

  it("passPhase is rejected while gainGig choice is pending", () => {
    const engine = CyberpunkTestEngine.createWithFixture({}, {}, { autoGainGig: false });

    endP1Turn(engine);

    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("gainGig");

    const p2 = engine.getActivePlayerId();
    const failure = engine.expectFailure(() => engine.passPhase({ as: p2 }));
    expect(failure.errorCode).toBe("PENDING_CHOICE_REQUIRED");
  });

  it("resolveAttack is rejected while gainGig choice is pending", () => {
    const engine = CyberpunkTestEngine.createWithFixture({}, {}, { autoGainGig: false });

    endP1Turn(engine);

    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("gainGig");

    const p2 = engine.getActivePlayerId();
    const failure = engine.expectFailure(() => engine.resolveAttack({ as: p2 }));
    expect(failure.errorCode).toBe("PENDING_CHOICE_REQUIRED");
  });

  it("gainGig choice must be explicitly resolved — it does not auto-select when passPhase is attempted", () => {
    const engine = CyberpunkTestEngine.createWithFixture({}, {}, { autoGainGig: false });

    endP1Turn(engine);

    const p2 = engine.getActivePlayerId();
    const fixerBefore = engine.getFixerDice(p2).length;
    const gigsBefore = engine.getGigCount(p2);

    // passPhase attempt must fail; fixer and gig counts must not change
    engine.expectFailure(() => engine.passPhase({ as: p2 }));

    expect(engine.getFixerDice(p2)).toHaveLength(fixerBefore);
    expect(engine.getGigCount(p2)).toBe(gigsBefore);
  });
});

// ── chooseGigsToSteal pending choice ─────────────────────────────────────

describe("chooseGigsToSteal pending choice", () => {
  function injectStealChoice(engine: CyberpunkTestEngine) {
    const attackerCard = engine.getCard(alphaSwordwiseHuscle, "field", P1);
    const p2Gigs = engine.getGigDice(P2);

    engine.judgeSetAttackState({
      attackerId: attackerCard.instanceId as CardInstanceId,
      defenderId: null,
      rivalId: P2 as unknown as PlayerId,
      kind: "direct",
      step: "steal",
    });
    engine.judgeSetPendingChoice({
      type: "chooseGigsToSteal",
      chooserId: P1 as unknown as PlayerId,
      effectId: attackerCard.instanceId as string,
      payload: {
        count: 1,
        attackerId: attackerCard.instanceId as CardInstanceId,
        rivalId: P2 as unknown as PlayerId,
        eligibleDieIds: p2Gigs.map((d) => d.id as GigDieId),
      },
    });
  }

  it("passPhase is rejected while chooseGigsToSteal choice is pending", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [alphaSwordwiseHuscle] },
      {
        gigArea: [
          { dieType: "d6", faceValue: 3 },
          { dieType: "d8", faceValue: 5 },
        ],
      },
    );

    injectStealChoice(engine);

    const failure = engine.expectFailure(() => engine.passPhase({ as: P1 }));
    expect(failure.errorCode).toBe("PENDING_CHOICE_REQUIRED");
  });

  it("resolveAttack is rejected while chooseGigsToSteal choice is pending", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [alphaSwordwiseHuscle] },
      {
        gigArea: [
          { dieType: "d6", faceValue: 3 },
          { dieType: "d8", faceValue: 5 },
        ],
      },
    );

    injectStealChoice(engine);

    const failure = engine.expectFailure(() => engine.resolveAttack({ as: P1 }));
    expect(failure.errorCode).toBe("PENDING_CHOICE_REQUIRED");
  });

  it("no gig is moved when passPhase is attempted with chooseGigsToSteal pending", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [alphaSwordwiseHuscle] },
      {
        gigArea: [
          { dieType: "d6", faceValue: 3 },
          { dieType: "d8", faceValue: 5 },
        ],
      },
    );

    injectStealChoice(engine);

    const p1GigsBefore = engine.getGigCount(P1);
    const p2GigsBefore = engine.getGigCount(P2);

    engine.expectFailure(() => engine.passPhase({ as: P1 }));

    expect(engine.getGigCount(P1)).toBe(p1GigsBefore);
    expect(engine.getGigCount(P2)).toBe(p2GigsBefore);
  });
});
