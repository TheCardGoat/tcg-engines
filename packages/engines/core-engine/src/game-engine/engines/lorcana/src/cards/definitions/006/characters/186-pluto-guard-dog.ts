// TODO: Once the set is released, we organize the cards by set and type

import { bodyguardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/bodyguardAbility";
import { thisCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const plutoGuardDog: LorcanaCharacterCardDefinition = {
  id: "mgd",
  missingTestCase: true,
  name: "Pluto",
  title: "Guard Dog",
  characteristics: ["storyborn", "ally"],
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nBRAVO While this character has no damage, he gets +4 {S}.",
  type: "character",
  abilities: [
    bodyguardAbility,
    {
      type: "static",
      ability: "effects",
      name: "Bravo",
      text: "While this character has no damage, he gets +4 {S}.",
      conditions: [
        { type: "damage", comparison: { operator: "eq", value: 0 } },
      ],
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 4,
          modifier: "add",
          duration: "turn",
          target: thisCharacter,
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 4,
  strength: 1,
  willpower: 5,
  lore: 1,
  illustrator: "Hedvig Häggman-Sund",
  number: 186,
  set: "006",
  rarity: "uncommon",
};
