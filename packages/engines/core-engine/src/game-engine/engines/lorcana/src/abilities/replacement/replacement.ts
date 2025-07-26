// **7.7. Replacement Effects**

// **7.7.1. **Some effects are considered *replacement effects*. These effects wait for the stated condition to occur and then partial y or completely replace the event as the effect resolves.

// **7.7.2. **Abilities that include the word “instead” are the most common type of replacement effect.

// ***Example:** Stolen Scimitar’s ability Slash reads, “*\{E\} * — Chosen character gets \+1 *\{S\} * this turn. If a character named Aladdin is* *chosen, he gets \+2 *\{S\} * instead.” *

// **7.7.3. **Abilities that include the word “skip” are replacement effects.

// **7.7.4. **Abilities that include “enter” or “enters” are replacement effects.

// **7.7.5. **Replacement effects happen once and need to exist before the event would occur. If an event is replaced, it never happens.

// A modified event occurs, and the new event may trigger abilities. Abilities that would have triggered from the original event don’t see it, and therefore they don’t trigger.

// **7.7.6. **Only one replacement effect can replace a specific effect. If there are multiple replacement effects for the same specific effect, the player who played the card that generated the effect being replaced chooses which effect replaces it.

// **7.7.7. **An effect that skips a step or phase of the game is a replacement effect that replaces that step or phase with nothing. “Skip \[Step/ Phase\]” means the same as “If a player would perform the \[Step/Phase\], do nothing instead.” If the effect skips a step or phase, no part of that step or phase happens. Any abilities or effects that would occur because of that step or phase don’t happen.

// ***Example:** Arthur – Determined Squire has an ability No More Books that reads, “Skip your turn’s Draw step.” When a player* *would start their Draw step with Arthur in play, they skip their Draw step instead and move immediately to the Main Phase* *of their turn. However, if a player finds a way to play Arthur during their Draw step, the current Draw step isn’t skipped and* *proceeds normally. *

import type {
  LorcanaAbility,
  LorcanaAbilityCost,
  LorcanaBaseAbility,
} from "~/game-engine/engines/lorcana/src/abilities/ability-types";

export interface LorcanaReplacementAbility extends LorcanaBaseAbility {
  type: "replacement";
  costs: LorcanaAbilityCost;
}

export const isReplacementAbility = (
  ability?: LorcanaAbility,
): ability is LorcanaReplacementAbility => ability?.type === "replacement";
