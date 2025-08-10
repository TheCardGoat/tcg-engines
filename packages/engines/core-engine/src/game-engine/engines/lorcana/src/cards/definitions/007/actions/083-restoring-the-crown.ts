import { exertCardEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { allOpposingCharactersTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const restoringTheCrown: LorcanaActionCardDefinition = {
  id: "oyt",
  name: "Restoring The Crown",
  characteristics: ["action"],
  text: "Exert all opposing characters. Whenever one of your characters banishes another character in a challenge this turn, gain 2 lore.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Exert all opposing characters. Whenever one of your characters banishes another character in a challenge this turn, gain 2 lore.",
      targets: [allOpposingCharactersTarget],
      effects: [
        exertCardEffect({ targets: [allOpposingCharactersTarget] }),
        // TODO: Requires trigger system for "whenever" challenge effects
      ],
    },
  ],
  inkwell: false,
  colors: ["amethyst", "steel"],
  cost: 6,
  illustrator: "Jochen van Gool",
  number: 83,
  set: "007",
  rarity: "rare",
};
