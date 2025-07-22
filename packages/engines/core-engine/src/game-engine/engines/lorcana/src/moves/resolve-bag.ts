import { createInvalidMove } from "~/game-engine/core-engine/move/move-types";
import { logger } from "~/shared/logger";
import type { LorcanaMove } from "./types";

/**
 * Resolve a trigger from the bag
 *
 * Note: The LorcanaMove type automatically provides properly typed `coreOps` as LorcanaCoreOperations,
 * so we can directly call Lorcana-specific methods like `resolveBagTrigger` without type casting.
 */
export const resolveBag: LorcanaMove = ({ G, coreOps }, triggerId: string) => {
  if (!G.bag.length) {
    return createInvalidMove("BAG_EMPTY", "moves.resolveBag.errors.emptyBag");
  }

  // Default behaviour is to resolve the first trigger in the bag
  const trigger = triggerId ? G.bag.find((t) => t.id === triggerId) : G.bag[0];
  if (!trigger) {
    return createInvalidMove(
      "TRIGGER_NOT_FOUND",
      "moves.resolveBag.errors.triggerNotFound",
      { triggerId },
    );
  }

  logger.debug("Resolving trigger from bag", { trigger });

  coreOps.resolveBagTrigger(trigger.id);

  return G;
};
