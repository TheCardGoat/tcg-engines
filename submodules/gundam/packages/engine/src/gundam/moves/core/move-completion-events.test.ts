/**
 * Move-completion event ordering.
 *
 * The deploy / pair moves emit a SYNCHRONOUS placement event when the
 * card lands in its destination zone (`UNIT_PLACED`, `BASE_PLACED`,
 * `PILOT_PAIRED`) and a DEFERRED completion event after every triggered
 * effect produced by the move has resolved (`UNIT_DEPLOYED`,
 * `BASE_DEPLOYED`, `PILOT_ASSIGNED`). The completion event is wired via
 * a sentinel `PendingEffect` enqueued at the tail of the move (see
 * `enqueueMoveCompletionFence` in `pending-effects.ts`); the sentinel
 * tier-sorts strictly last so it runs after own-card triggers, observer
 * triggers, and any rule 10-1-6-7 preempts that arrive in between.
 *
 * The split lets listeners distinguish "the card is in this zone now"
 * (UI animations) from "the deploy / pair is fully done, the resulting
 * board state is safe to read" (analytics, AI, replay summaries).
 */

import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  createMockUnit,
  createMockBase,
  createMockResource,
} from "../../index.ts";

function captureEventTypes(result: {
  gameEvents?: readonly { event: { type: string } }[];
}): string[] {
  return (result.gameEvents ?? []).map((e) => e.event.type);
}

describe("move-completion event ordering", () => {
  it("deployUnit emits UNIT_PLACED synchronously and UNIT_DEPLOYED after drain", () => {
    const unit = createMockUnit({ ap: 1, hp: 1, cost: 1, level: 1 });
    const engine = GundamTestEngine.create(
      { hand: [unit], resourceArea: [createMockResource(), createMockResource()] },
      {},
    );
    const cardId = engine.asPlayer(PLAYER_ONE).getCardsInZone("hand")[0]!;

    const result = engine.asPlayer(PLAYER_ONE).deployUnit(cardId, {});
    expectSuccess(result);
    if (!result.success) throw new Error("unreachable");

    const types = captureEventTypes(result);
    const placedIdx = types.indexOf("UNIT_PLACED");
    const deployedIdx = types.indexOf("UNIT_DEPLOYED");
    expect(placedIdx).toBeGreaterThanOrEqual(0);
    expect(deployedIdx).toBeGreaterThanOrEqual(0);
    // PLACED is the synchronous zone-change signal; DEPLOYED is the
    // post-drain completion signal. The drain runs after the move
    // returns, so PLACED appears strictly earlier in the captured stream.
    expect(placedIdx).toBeLessThan(deployedIdx);
  });

  it("deployBase emits BASE_PLACED synchronously and BASE_DEPLOYED after drain", () => {
    const base = createMockBase({ hp: 3, cost: 1, level: 1 });
    const engine = GundamTestEngine.create(
      { hand: [base], resourceArea: [createMockResource(), createMockResource()] },
      {},
    );
    const cardId = engine.asPlayer(PLAYER_ONE).getCardsInZone("hand")[0]!;

    const result = engine.asPlayer(PLAYER_ONE).deployBase(cardId, {});
    expectSuccess(result);
    if (!result.success) throw new Error("unreachable");

    const types = captureEventTypes(result);
    const placedIdx = types.indexOf("BASE_PLACED");
    const deployedIdx = types.indexOf("BASE_DEPLOYED");
    expect(placedIdx).toBeGreaterThanOrEqual(0);
    expect(deployedIdx).toBeGreaterThanOrEqual(0);
    expect(placedIdx).toBeLessThan(deployedIdx);
  });

  it("the completion fence drains naturally — pendingEffects is empty after the move", () => {
    // The sentinel `PendingEffect` enqueued for the completion fence
    // auto-resolves during the post-move drain (it has no card body and
    // never halts). After the move returns, the queue should be empty.
    const unit = createMockUnit({ ap: 1, hp: 1, cost: 1, level: 1 });
    const engine = GundamTestEngine.create(
      { hand: [unit], resourceArea: [createMockResource(), createMockResource()] },
      {},
    );
    const cardId = engine.asPlayer(PLAYER_ONE).getCardsInZone("hand")[0]!;

    expectSuccess(engine.asPlayer(PLAYER_ONE).deployUnit(cardId, {}));
    expect(engine.getG().pendingEffects).toHaveLength(0);
  });
});
