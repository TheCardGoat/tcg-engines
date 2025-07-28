import type { LorcanaEffect } from "~/game-engine/engines/lorcana/src/abilities/effect-types";

export class EffectBuilder {
  // Preferably we should use target from the parent LorcanaAbility, we should only add targets here if they are not already defined in the parent ability.
  // Or if the ability has multiple effects that need different targets.
  static fromText(cardText: string, skipTarget?: boolean): LorcanaEffect[] {
    const effects: LorcanaEffect[] = [];

    return effects;
  }
}
