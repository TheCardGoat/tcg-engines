import { describe, expect, test } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P2,
  createMockGear,
  createMockUnit,
  type MatchState,
} from "@tcg/cyberpunk-engine";
import {
  buildInteractionSubmission,
  buildInteractionSubmissionForActionId,
  validateInteractionSubmission,
  type EngineInteractionView,
  type InteractionInput,
} from "@tcg/protocol";
import { CyberpunkServerEngine } from "./cyberpunk-server-engine.ts";

/**
 * Regression coverage for the live `move_rejected` loop (F3): the automation
 * path minted interaction envelopes from the fresh server view while the
 * values came from a stale local mirror, so `attachToId` referenced an entity
 * the authoritative view no longer advertised. The server rejected every
 * submission with `Entity … is not an enabled candidate for input
 * "attachToId"` and the client never repaired its mirror.
 *
 * These tests pin the contract on both sides of that exchange:
 * 1. every attachToId candidate the view advertises is accepted by the real
 *    `submitInteraction` path against a real engine board with gear in hand;
 * 2. a fresh envelope carrying a prior-state attachToId value is rejected with
 *    exactly one candidate message (the observed defect signature).
 */

const GEAR = createMockGear({ id: "adapter-attach-gear", cost: 1 });
const UNIT_A = createMockUnit({ id: "adapter-attach-unit-a", cost: 1 });
const UNIT_B = createMockUnit({ id: "adapter-attach-unit-b", cost: 1 });

function createGearAttachBoard(): CyberpunkTestEngine {
  return CyberpunkTestEngine.createWithFixture(
    { field: [], gigArea: [] },
    {
      hand: [GEAR],
      field: [
        { card: UNIT_A, spent: false },
        { card: UNIT_B, spent: false },
      ],
      gigArea: [{ dieType: "d4", faceValue: 1 }],
      eddies: 5,
    },
    { activePlayerId: P2, seed: "gear-attach-candidates" },
  );
}

function gearInstanceIdInHand(board: CyberpunkTestEngine): string {
  const gear = board.getCardsInZone("hand", P2).find((card) => card.definitionId === GEAR.id);
  expect(gear).toBeDefined();
  return gear!.instanceId as string;
}

function attachCandidateIds(view: EngineInteractionView): string[] {
  const playCard = view.actions.find((action) => action.id === "playCard");
  expect(playCard).toBeDefined();
  if (!playCard) return [];
  const attachInput = playCard.inputs.find(
    (input): input is Extract<InteractionInput, { kind: "entity-selection" }> =>
      input.kind === "entity-selection" && input.id === "attachToId",
  );
  expect(attachInput).toBeDefined();
  if (!attachInput) return [];
  return attachInput.candidates.map((candidate) => candidate.entity.instanceId);
}

describe("server adapter gear attach interaction contract", () => {
  test("every attachToId candidate the view advertises is accepted by submitInteraction", () => {
    const board = createGearAttachBoard();
    const serverEngine = new CyberpunkServerEngine(board.getLocalEngine());
    const view = serverEngine.getInteractionView(P2);
    const candidateIds = attachCandidateIds(view);
    expect(candidateIds).toHaveLength(2);
    const cardId = gearInstanceIdInHand(board);

    for (const attachToId of candidateIds) {
      // The fixture is deterministic, so each advertised candidate is replayed
      // against an identical fresh board — acceptance must not depend on
      // submission order (the first accepted play consumes the gear).
      const fresh = createGearAttachBoard();
      const freshEngine = new CyberpunkServerEngine(fresh.getLocalEngine());
      const freshView = freshEngine.getInteractionView(P2);
      expect(attachCandidateIds(freshView)).toEqual(candidateIds);

      const submission = buildInteractionSubmissionForActionId({
        view: freshView,
        actionId: "playCard",
        values: { cardId, attachToId },
      });
      expect(submission).not.toBeNull();
      if (!submission) return;

      const result = freshEngine.submitInteraction(P2, submission, {
        gameId: "gear-attach-candidates",
        sourceAuthority: "server",
      });
      expect(result.success).toBe(true);
      if (!result.success) return;

      const state = result.state as MatchState;
      const gearCard = state.G.players[P2 as string]!.zones.field.map(
        (instanceId) => state.G.cardIndex[instanceId as string]!,
      ).find((card) => card.definitionId === GEAR.id);
      expect(gearCard).toBeDefined();
      expect(gearCard!.meta.attachedToId).toBe(attachToId);
    }
  });

  test("fresh envelope with a prior-state attachToId value is rejected with the lone candidate message", () => {
    const board = createGearAttachBoard();
    const staleEngine = new CyberpunkServerEngine(board.getLocalEngine());
    const staleView = staleEngine.getInteractionView(P2);
    const staleTargetId = attachCandidateIds(staleView)[0]!;
    const cardId = gearInstanceIdInHand(board);

    // The authoritative board advances: the previously advertised attach
    // target leaves the field — the exact mirror divergence the live loop hit.
    board.judgeMoveCardToZone(staleTargetId, "trash", { as: P2 });

    const freshEngine = new CyberpunkServerEngine(board.getLocalEngine());
    const freshView = freshEngine.getInteractionView(P2);
    expect(attachCandidateIds(freshView)).not.toContain(staleTargetId);

    const freshAction = freshView.actions.find((action) => action.id === "playCard");
    expect(freshAction).toBeDefined();
    if (!freshAction) return;

    // Production signature: the envelope is minted from the FRESH server view
    // while the values come from the stale local mirror.
    const submission = buildInteractionSubmission({
      view: freshView,
      action: freshAction,
      values: { cardId, attachToId: staleTargetId },
    });
    const validation = validateInteractionSubmission(freshView, submission);
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(validation.issues).toHaveLength(1);
    expect(validation.issues[0]).toMatchObject({
      code: "candidate_unavailable",
      message: `Entity "${staleTargetId}" is not an enabled candidate for input "attachToId".`,
    });

    const result = freshEngine.submitInteraction(P2, submission, {
      gameId: "gear-attach-stale-value",
      sourceAuthority: "server",
    });
    expect(result.success).toBe(false);
    expect(result.errorCode).toBe("invalid_interaction_submission");
  });
});
