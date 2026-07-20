import { createMockResource } from "@tcg/gundam-engine";

import { createDevRuntime, DEV_PLAYER_ONE, type DevRuntime } from "../dev-runtime.ts";

/** Starts the viewer clock inside the red, sub-ten-second urgency window. */
export function loadUrgentTimerDemo(): DevRuntime {
  const dev = createDevRuntime({
    skipToMainPhase: true,
    p1: {
      resourceArea: [createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      deck: 30,
      resourceDeck: 10,
    },
  });
  const state = dev.runtime.getState();
  if (state.ctx.time.mode === "dynamic") {
    const now = Date.now();
    state.ctx.time.activePlayerID = DEV_PLAYER_ONE;
    // Keep the countdown inside the urgency window long enough for a human
    // visual pass without pausing it. deriveClockView clamps future elapsed
    // time to zero, so the fixture remains at 0:08 for one minute.
    state.ctx.time.startedAtMs = now + 60_000;
    state.ctx.time.running = true;
    state.ctx.time.players[DEV_PLAYER_ONE]!.reserveMsRemaining = 8_500;
    state.ctx.time.players[DEV_PLAYER_ONE]!.lastUpdatedAtMs = now;
  }
  return dev;
}
