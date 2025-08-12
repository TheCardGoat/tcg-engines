import type { LayerItem } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import { logger } from "~/shared/logger";

export function shouldAutoResolveLayer(_layer: LayerItem) {
  logger.log("shouldAutoResolveLayer layer", true);
  return true;
}
