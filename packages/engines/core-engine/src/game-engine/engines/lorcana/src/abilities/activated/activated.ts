// **7.5. Activated Abilities**

// **7.5.1. **Activated abilities are abilities that a player chooses to use. They are normal y written as \[Cost\] — \[Effect\].

// **7.5.2. **While there are no effects waiting to resolve and a character isn’t questing or in a chal enge, the active player may use an activated ability.

// **7.5.3. **To use an activated ability, the active player fol ows these steps in order. If any part of this process can’t be performed, it’s il egal to use the ability. These steps apply to all activated abilities. Only the active player can use activated abilities.

// **7.5.3.1. **First, the active player announces the ability they intend to use.

// **7.5.3.2. **Second, the player fol ows the steps described in 4.3.4.4 through 4.3.4.6, replacing any instance of the word “card”

// with the word “ability.”

// **7.5.3.3. **Once the total cost is paid, the ability is activated. The active player resolves the effect immediately.

// **7.5.4. **If an effect would trigger as a result of any of the steps to using an activated ability, that effect waits to resolve until the ability is ful y resolved.

import type {
  LorcanaAbility,
  LorcanaAbilityCost,
  LorcanaBaseAbility,
} from "~/game-engine/engines/lorcana/src/abilities/ability-types";

export interface LorcanaActivatedAbility extends LorcanaBaseAbility {
  type: "activated";
  costs: LorcanaAbilityCost | Array<{ type: string; [key: string]: any }>; // Legacy: array format
  conditions?: any[]; // Legacy: conditions array
  effects?: any[]; // Legacy: effects array
  oncePerTurn?: boolean; // Legacy: once per turn flag
  resolveEffectsIndividually?: boolean; // Legacy: resolve effects one at a time
  nameACard?: boolean; // Legacy: requires naming a card
}

export const isActivatedAbility = (
  ability?: LorcanaAbility,
): ability is LorcanaActivatedAbility => ability?.type === "activated";
