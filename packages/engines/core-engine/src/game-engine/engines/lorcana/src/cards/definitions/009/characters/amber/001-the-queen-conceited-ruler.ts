import { atTheStartOfYourTurn } from "~/game-engine/engines/lorcana/src/abilities/atTheAbilities";
import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import { thisCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theQueenConceitedRuler: LorcanaCharacterCardDefinition = {
  id: "xvm",
  name: "The Queen",
  title: "Conceited Ruler",
  characteristics: ["storyborn", "villain", "queen", "sorcerer"],
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nROYAL SUMMONS At the start of your turn, you may choose and discard a Princess or Queen character card to return a character card from your discard to your hand.",
  type: "character",
  inkwell: true,
  colors: ["amber"],
  cost: 3,
  strength: 2,
  willpower: 4,
  illustrator: "Eri Welli",
  number: 1,
  set: "009",
  rarity: "rare",
  lore: 1,
  abilities: [
    supportAbility,
    atTheStartOfYourTurn({
      name: "ROYAL SUMMONS",
      text: "At the start of your turn, you may choose and discard a Princess or Queen character card to return a character card from your discard to your hand",
      optional: true,
      effects: [
        {
          type: "discard",
          amount: 1,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "hand" },
              { filter: "owner", value: "self" },
              {
                filter: "characteristics",
                value: ["princess", "queen"],
                conjunction: "or",
              },
            ],
          },
          afterEffect: [
            {
              type: "create-layer-based-on-target",
              target: thisCharacter,
              effects: [
                {
                  type: "move",
                  to: "hand",
                  target: {
                    type: "card",
                    value: 1,
                    filters: [
                      { filter: "owner", value: "self" },
                      { filter: "type", value: "character" },
                      { filter: "zone", value: "discard" },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
};
