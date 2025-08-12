import { gainsAbilityEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { yourCharactersTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

// Custom ability for Food Fight needs to be imported from the correct location
// This would need to be defined properly in the abilities system

export const foodFight: LorcanaActionCardDefinition = {
  id: "mwi",
  missingTestCase: true,
  name: "Food Fight!",
  characteristics: ["action"],
  text: "Your characters gain {E}, 1 {I} – Deal 1 damage to chosen character this turn.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Your characters gain {E}, 1 {I} – Deal 1 damage to chosen character this turn.",
      targets: [yourCharactersTarget],
      effects: [
        // This would need a proper custom ability effect for the activated ability
        // The structure depends on how custom abilities are implemented in the new system
      ],
    },
  ],
  flavour: "Gawrsh, who ordered the... upside-down CAA-AA-AKE?",
  colors: ["steel"],
  cost: 1,
  illustrator: "Leonardo Giammichele",
  number: 199,
  set: "SSK",
  rarity: "uncommon",
};
