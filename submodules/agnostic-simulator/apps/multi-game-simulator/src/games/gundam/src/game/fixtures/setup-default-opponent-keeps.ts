import { DEV_PLAYER_TWO } from "../dev-runtime.ts";
import type { DevRuntime } from "../dev-runtime.ts";
import { attachAutoMulliganKeep } from "./auto-mulligan.ts";
import { loadSetupDefault } from "./setup-default.ts";

/**
 * Same clean start-of-match seed as `setup-default`, plus a reactive handler
 * that auto-submits `alterHand {wantsRedraw:false}` for the opponent the
 * moment the mulligan phase begins.
 *
 * Rationale: the simulator boots with a single viewer seat. Shields (6-2-2),
 * EX Base tokens (6-2-3), and EX Resource (6-2-4) are all filled by the
 * mulligan phase's `onExit` — which never fires until BOTH players have
 * submitted `alterHand`. Without this helper, a single-seat E2E run stalls
 * forever after the viewer's mulligan decision. Use this fixture for any
 * setup-flow milestone past mulligan until a real opponent (bot or network
 * peer) is wired in.
 */
export function loadSetupDefaultOpponentKeeps(): DevRuntime {
  const dev = loadSetupDefault();
  attachAutoMulliganKeep(dev.runtime, DEV_PLAYER_TWO);
  return dev;
}
