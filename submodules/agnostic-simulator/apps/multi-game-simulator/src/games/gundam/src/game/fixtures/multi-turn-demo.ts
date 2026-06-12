import { createMockResource, createMockUnit } from "@tcg/gundam-engine";

import {
  createDevRuntime,
  DEV_PLAYER_ONE,
  DEV_PLAYER_TWO,
  type DevRuntime,
} from "../dev-runtime.ts";
import { attachAutoPassBot } from "./auto-pass.ts";
import { attachAutoPassTurnBot } from "./auto-pass-turn.ts";

/**
 * Multi-turn fixture — seats the viewer in main-phase with one cost-1 unit
 * in hand and three ready resources, and an opponent whose turn will
 * auto-terminate so the engine cycles control back to the viewer for a
 * second turn.
 *
 * Exists to lock in the cross-turn plumbing that's invisible to any
 * single-turn spec: after the viewer passes, `start-phase/active-step`
 * readies exhausted cards, `resource-phase` adds a fresh resource, and
 * `draw-phase` deals a card. Deploy-then-pass-then-observe is the only
 * way to see all three effects at the UI layer in one run.
 *
 * Opponent needs a populated `deck` so their draw-phase doesn't blow
 * up during their auto-pass-turn — same for the viewer's turn-2 draw.
 */
export function loadMultiTurnDemo(): DevRuntime {
  const dev = createDevRuntime({
    skipToMainPhase: true,
    p1: {
      hand: [createMockUnit({ cost: 1, level: 1, ap: 2, hp: 3, color: "blue", name: "RX-78-2" })],
      resourceArea: [createMockResource(), createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      resourceArea: [createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
  });

  // Opponent has no UI seat, so we auto-end their turn the moment the
  // engine hands them control. Without this the viewer's `passTurn`
  // stalls out on the opponent's main-phase forever.
  attachAutoPassTurnBot(dev.runtime, dev.staticResources, DEV_PLAYER_TWO);

  // Belt-and-braces: end-phase action-step sets BOTH players as
  // pending-decision with `passActionStep` as the only legal move; the
  // step only ends when pendingDecision is empty. The viewer has no UI
  // control for this specific step (the cockpit PASS TURN button only
  // emits `passTurn`, not `passActionStep`), so without a viewer-side
  // step-bot the turn cycle freezes in end-phase after the viewer's
  // initial passTurn. Opponent's bot mirrors the same need on the other
  // turn.
  attachAutoPassBot(dev.runtime, dev.staticResources, DEV_PLAYER_ONE);
  attachAutoPassBot(dev.runtime, dev.staticResources, DEV_PLAYER_TWO);

  return dev;
}
