import { dealDamageEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const smash: LorcanaActionCardDefinition = {
  id: "ub4",
  name: "Smash",
  characteristics: ["action"],
  text: "Deal 3 damage to chosen character.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Deal 3 damage to chosen character.",
      targets: [chosenCharacterTarget],
      effects: [
        dealDamageEffect({
          value: 3,
        }),
      ],
    },
  ],
  flavour: '"Go away!"',
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  illustrator: "Simangaliso Sibaya",
  number: 200,
  set: "TFC",
  rarity: "uncommon",
};
