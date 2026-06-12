import type { PlayerId } from "@tcg/lorcana-engine";
import { REPEATED_STATE_DEADLOCK_THRESHOLD } from "../../lib/features/simulator-devtools/automation-deadlock.js";

export {
  createRepeatedStateDeadlockTracker,
  resolveRepeatedStateDeadlockByConceding,
} from "../../lib/features/simulator-devtools/automation-deadlock.js";

export const STRATEGY_REPEAT_THRESHOLD = REPEATED_STATE_DEADLOCK_THRESHOLD;
export const STRATEGY_TURN_LIMIT = 35;
export const STRATEGY_ACTION_LIMIT = 250;

export type StrategyMatchEndReason =
  | "winner"
  | "turn-limit"
  | "action-limit"
  | "repeated-state-deadlock";

export function resolveStrategyMatchEndReason(args: {
  actionCount: number;
  actionLimit?: number;
  pendingDeadlock: boolean;
  turnLimit?: number;
  turnNumber: number;
  winner?: PlayerId;
}): StrategyMatchEndReason | undefined {
  if (args.winner) {
    return "winner";
  }

  if (args.pendingDeadlock) {
    return "repeated-state-deadlock";
  }

  if (args.turnNumber > (args.turnLimit ?? STRATEGY_TURN_LIMIT)) {
    return "turn-limit";
  }

  if (args.actionCount > (args.actionLimit ?? STRATEGY_ACTION_LIMIT)) {
    return "action-limit";
  }

  return undefined;
}
