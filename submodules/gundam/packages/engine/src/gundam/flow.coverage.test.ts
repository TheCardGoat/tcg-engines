/**
 * Flow coverage — `resolveEffect` listing.
 *
 * Replaces the previously proposed framework-level `globalMoves` escape
 * hatch. Rather than allowing `resolveEffect` to bypass the phase/step
 * `validMoves` design implicitly, we keep the per-phase listing as the
 * single source of truth and assert via this test that every player-
 * action window that can produce pending effects lists it explicitly.
 *
 * Two-way drift guard:
 *   1. forward — every phase/step with a non-empty `validMoves` array
 *      (i.e. a player-decision window) must list `resolveEffect`. Forgetting
 *      to add it to a new phase fails CI.
 *   2. reverse — every phase that lists `resolveEffect` must be a
 *      player-decision window (`validMoves` non-empty AND admits some
 *      move other than `resolveEffect` / `concede`). Listing it on a
 *      pure system phase is a bug.
 */

import { describe, it, expect } from "vite-plus/test";
import type { FlowDefinition, PhaseDefinition, StepDefinition } from "../types/index.ts";
import { gundamFlow } from "./flow.ts";

interface FlowNode {
  readonly path: string;
  readonly validMoves: readonly string[] | undefined;
}

function walkFlow(flow: FlowDefinition): FlowNode[] {
  const out: FlowNode[] = [];
  for (const [segId, seg] of Object.entries(flow.gameSegments)) {
    out.push({ path: `${segId}`, validMoves: seg.validMoves });
    const phases = seg.turn?.phases ?? {};
    for (const [phaseId, phase] of Object.entries(phases)) {
      const phaseDef = phase as PhaseDefinition;
      const phasePath = `${segId}/${phaseId}`;
      out.push({ path: phasePath, validMoves: phaseDef.validMoves });
      const steps = phaseDef.steps ?? {};
      for (const [stepId, step] of Object.entries(steps)) {
        const stepDef = step as StepDefinition;
        out.push({ path: `${phasePath}/${stepId}`, validMoves: stepDef.validMoves });
      }
    }
  }
  return out;
}

const RESOLVE_EFFECT = "resolveEffect";

// Moves that are admissible in player-action windows but don't themselves
// indicate "this window can produce pending effects". When the only
// non-`resolveEffect` moves in a window come from this set, the window
// is treated as not requiring pending-effect resolution.
//
//   chooseFirstPlayer — pre-mulligan; no cards in play, no effects
//                       possible. The phase ends the moment turnPlayer
//                       is set, so a pending queue can neither pre-
//                       exist nor be produced here.
const NON_PENDING_PRODUCING_MOVES = new Set<string>(["chooseFirstPlayer"]);

function isPlayerActionWindow(node: FlowNode): boolean {
  const moves = node.validMoves;
  if (!moves || moves.length === 0) return false;
  // A window that *only* lists resolveEffect is degenerate — treat it
  // as not a player-action window so the reverse check below rejects it.
  const nonResolve = moves.filter((m) => m !== RESOLVE_EFFECT);
  if (nonResolve.length === 0) return false;
  const meaningful = nonResolve.filter((m) => !NON_PENDING_PRODUCING_MOVES.has(m));
  return meaningful.length > 0;
}

describe("Flow coverage: resolveEffect listing", () => {
  const nodes = walkFlow(gundamFlow);

  it("lists resolveEffect in every player-action window", () => {
    const missing: string[] = [];
    for (const node of nodes) {
      if (!isPlayerActionWindow(node)) continue;
      if (!node.validMoves!.includes(RESOLVE_EFFECT)) missing.push(node.path);
    }
    expect(missing).toEqual([]);
  });

  it("does not list resolveEffect in non-player-action windows", () => {
    const extraneous: string[] = [];
    for (const node of nodes) {
      const moves = node.validMoves;
      if (!moves || !moves.includes(RESOLVE_EFFECT)) continue;
      if (!isPlayerActionWindow(node)) extraneous.push(node.path);
    }
    expect(extraneous).toEqual([]);
  });
});
