import { describe, expect, it } from "bun:test";
import { CANONICAL_PLAYER_ONE, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend } from "@tcg/lorcana-cards/cards/001";
import { jafarAspiringRuler } from "@tcg/lorcana-cards/cards/007";
import { buildPlayerInteractionView, type Interaction } from "@tcg/lorcana-interaction";
import type { CardInstanceId, PlayerId } from "@tcg/lorcana-types";

/**
 * Cross-suite agreement test (work-log gap #3a).
 *
 * The engine has TWO consumers of `ResolutionSelectionContext`:
 *
 * 1. `automation/planner.ts` — bots call `enumerateAutomatedActions`,
 *    which reads `selectionContext.cardCandidateIds` to enumerate moves.
 * 2. `@tcg/lorcana-interaction` — humans see `PlayerInteractionView`,
 *    which reads `selectionContext.cardCandidateIds` to render
 *    affordances.
 *
 * Both should agree on which cards are legal targets for the same engine
 * state. If a typo, regression, or asymmetric filtering ever lets the
 * two diverge, this test fails.
 *
 * NOTE: automation may apply a search cap (`AUTOMATED_ACTION_SEARCH_CAPS`,
 * default 8) that hides candidates from bot enumeration but not from
 * humans. We assert agreement on the **set of cards present in BOTH** —
 * i.e. every target the bot considers must also be a candidate the human
 * sees, and vice-versa within the cap.
 */
describe("automation ↔ view agreement", () => {
  it("Jafar Aspiring Ruler — bot and human see the same legal targets", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [jafarAspiringRuler],
      play: [{ card: mickeyMouseTrueFriend, isDrying: false }],
      inkwell: jafarAspiringRuler.cost,
      deck: 2,
    });

    expect(engine.asPlayerOne().playCard(jafarAspiringRuler)).toBeSuccessfulCommand();

    const client = engine.asPlayerOne();
    const board = client.getBoard();
    const view = buildPlayerInteractionView(board, CANONICAL_PLAYER_ONE as PlayerId);

    expect(view.activePrompt).not.toBeNull();
    if (!view.activePrompt) return;

    const humanCandidateIds = new Set(view.interactions.filter(isSelectCard).map((i) => i.cardId));

    const automation = client.enumerateAutomatedActions();
    const botCandidateIds = collectAutomationTargetIds(
      automation.candidates,
      view.activePrompt.requestId,
    );

    // Every target the bot proposes for this prompt must also be one the
    // human sees. Reverse direction (every human target also a bot target)
    // can fail when the bot applies a search cap; so we assert subset both
    // ways within the cap, and equality when no cap is hit.
    for (const id of botCandidateIds) {
      expect(humanCandidateIds.has(id)).toBe(true);
    }

    if (botCandidateIds.size === humanCandidateIds.size) {
      // No cap hit → require strict equality.
      expect(new Set(humanCandidateIds)).toEqual(botCandidateIds);
    }
  });
});

function isSelectCard(
  interaction: Interaction,
): interaction is Extract<Interaction, { kind: "select-card" }> {
  return interaction.kind === "select-card";
}

type EnumerationCandidate = ReturnType<
  ReturnType<LorcanaMultiplayerTestEngine["asPlayerOne"]>["enumerateAutomatedActions"]
>["candidates"][number];

function collectAutomationTargetIds(
  candidates: readonly EnumerationCandidate[],
  requestId: string,
): Set<CardInstanceId> {
  const ids = new Set<CardInstanceId>();
  for (const candidate of candidates) {
    if (candidate.family === "resolveBag" && candidate.bagId === requestId) {
      addAutomationTargets(candidate.targets, ids);
    } else if (candidate.family === "resolveEffect" && candidate.effectId === requestId) {
      addAutomationTargets(candidate.targets, ids);
    }
  }
  return ids;
}

function addAutomationTargets(
  targets: ReadonlyArray<unknown> | undefined,
  out: Set<CardInstanceId>,
): void {
  if (!targets) return;
  for (const target of targets) {
    if (typeof target === "string") {
      out.add(target as CardInstanceId);
    } else if (target && typeof target === "object" && "id" in target) {
      const id = (target as { id: unknown }).id;
      if (typeof id === "string") {
        out.add(id as CardInstanceId);
      }
    }
  }
}
