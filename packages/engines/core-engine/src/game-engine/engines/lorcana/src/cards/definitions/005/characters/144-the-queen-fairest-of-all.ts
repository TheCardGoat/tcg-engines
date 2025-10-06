import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import {
  shiftAbility,
  wardAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theQueenFairestOfAll: LorcanitoCharacterCardDefinition = {
  id: "de9",
  name: "The Queen",
  title: "Fairest of All",
  characteristics: ["floodborn", "queen", "sorcerer", "villain"],
  text: "**Shift** 3 _(You may pay 3 {I} to play this on top of one of your characters named The Queen.)_ **Ward** _(Opponents can’t choose this character except to challenge.)_\n \n**REFLECTIONS OF VANITY** For each other character named The Queen you have in play, this character gets +1 {L}.",
  type: "character",
  abilities: [
    shiftAbility(3, "The Queen"),
    wardAbility,
    {
      type: "static",
      ability: "effects",
      name: "REFLECTIONS OF VANITY",
      text: "For each other character named The Queen you have in play, this character gets +1 {L}.",
      effects: [
        {
          type: "attribute",
          attribute: "lore",
          amount: {
            dynamic: true,
            excludeSelf: true,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "type", value: "character" },
              {
                filter: "attribute",
                value: "name",
                comparison: { operator: "eq", value: "The Queen" },
              },
              { filter: "zone", value: "play" },
            ],
          },
          modifier: "add",
          target: thisCharacter,
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 5,
  strength: 2,
  willpower: 6,
  lore: 1,
  illustrator: "Aisha Durmagambetova",
  number: 144,
  set: "SSK",
  rarity: "super_rare",
};
