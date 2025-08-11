import type { LorcanaCard } from "~/game-engine/engines/lorcana/src/cards/lorcana-game-card";
import type { LorcanaCoreOperations } from "~/game-engine/engines/lorcana/src/operations/lorcana-core-operations";
import { logger } from "~/shared/logger";

export function addAbilitiesToResolve(
  this: LorcanaCoreOperations,
  source: LorcanaCard,
): void {
  if (!source) {
    logger.error("Cannot add abilities to resolve: source is undefined");
    return;
  }

  if (!source.abilities || source.abilities.length === 0) {
    logger.warn("No abilities to add to resolve for source:", source);
    return;
  }

  for (let i = source.abilities.length - 1; i >= 0; i--) {
    const ability = source.abilities[i];

    // Check if the ability is valid and can be added
    if (ability && this.canAddAbilityToResolve(ability, source)) {
      this.addAbilityToResolve(ability, source);
      logger.info(
        `Added ability to resolve: ${ability.name} from ${source.name}`,
      );
    } else {
      logger.warn(
        `Cannot add ability to resolve: ${ability?.name} from ${source.name}`,
      );
    }
  }
}
