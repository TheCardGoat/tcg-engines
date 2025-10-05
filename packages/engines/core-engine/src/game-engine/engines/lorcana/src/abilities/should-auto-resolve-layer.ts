import type { LayerItem } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import { logger } from "~/shared/logger";

/**
 * Determine if a layer should auto-resolve or wait for player input.
 * Layers with optional targets should NOT auto-resolve - they need explicit resolution.
 */
export function shouldAutoResolveLayer(layer: LayerItem) {
  // Check if any effect has optional targets (requires player selection)
  const ability = layer.ability;
  if (!ability) {
    logger.log("shouldAutoResolveLayer: no ability, auto-resolving");
    return true;
  }

  // Check if ability has target definitions with optional flag
  const targets = (ability as any).targets;
  if (targets && Array.isArray(targets)) {
    for (const target of targets) {
      if (target.optional === true) {
        logger.log(
          "shouldAutoResolveLayer: found optional target, NOT auto-resolving",
        );
        return false;
      }
    }
  }

  // Check effects for optional targets or manual targeting requirements
  const effects = (ability as any).effects;
  if (effects && Array.isArray(effects)) {
    for (const effect of effects) {
      // Check for modal effects - they require player choice
      if (effect.type === "modal") {
        logger.log(
          "shouldAutoResolveLayer: found modal effect, NOT auto-resolving",
        );
        return false;
      }

      const effectTargets = effect.targets;
      if (effectTargets && Array.isArray(effectTargets)) {
        for (const target of effectTargets) {
          // Target requires manual selection if:
          // 1. It's marked as optional
          // 2. It requires a specific count (count === 1 or count > 0)
          if (target.optional === true) {
            logger.log(
              "shouldAutoResolveLayer: found optional target in effect, NOT auto-resolving",
            );
            return false;
          }
          if (target.count !== undefined && target.count > 0) {
            logger.log(
              "shouldAutoResolveLayer: found target with specific count requirement, NOT auto-resolving",
            );
            return false;
          }
        }
      }
    }
  }

  logger.log(
    "shouldAutoResolveLayer: no manual targeting required, auto-resolving",
  );
  return true;
}
