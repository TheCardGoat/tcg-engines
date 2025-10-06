// TODO: Once the set is released, we organize the cards by set and type

import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const wendyDarlingCourageousCaptain: LorcanitoCharacterCardDefinition = {
  id: "mxj",
  name: "Wendy Darling",
  title: "Courageous Captain",
  characteristics: ["dreamborn", "hero", "pirate", "captain"],
  text: "Evasive (Only characters with Evasive can challenge this character.)\nLOOK LIVELY, CREW! While you have another Pirate character in play, this character gets +1 {S} and +1 {L}.",
  type: "character",
  abilities: [
    evasiveAbility,
    {
      type: "static",
      ability: "effects",
      name: "Look Lively, Crew!",
      text: "While you have another Pirate character in play, this character gets +1 {S} and +1 {L}.",
      conditions: [
        {
          type: "filter",
          comparison: { operator: "gte", value: 2 },
          filters: [
            { filter: "characteristics", value: ["pirate"] },
            { filter: "owner", value: "self" },
            { filter: "zone", value: "play" },
          ],
        },
      ],
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 1,
          modifier: "add",
          target: thisCharacter,
        },
        {
          type: "attribute",
          attribute: "lore",
          amount: 1,
          modifier: "add",
          target: thisCharacter,
        },
      ],
    },
  ],
  inkwell: false,
  colors: ["ruby"],
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  illustrator: "French Carlomagno / Mariana Moreno",
  number: 108,
  set: "006",
  rarity: "rare",
};
