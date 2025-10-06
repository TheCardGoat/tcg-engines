import {
  chosenCharacter,
  chosenDamagedCharacter,
} from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const annaDiplomaticQueen: LorcanaCharacterCardDefinition = {
  id: "x1z",
  name: "Anna",
  title: "Diplomatic Queen",
  characteristics: ["hero", "queen", "storyborn"],
  text: "**ROYAL RESOLUTION** When you play this character you may pay 2 {I} to chose one:\n* Each opponent choses and discards a card.\n* Chosen character gets +2 {S} this turn. \n* Banish chosen damaged character.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "Royal Resolution",
      text: "When you play this character you may pay 2 {I} to chose one:\n* Each opponent choses and discards a card.\n* Chosen character gets +2 {S} this turn. \n* Banish chosen damaged character.",
      optional: true,
      costs: [{ type: "ink", amount: 2 }],
      effects: [
        {
          type: "modal",
          // TODO: Get rid of target
          target: chosenCharacter,
          modes: [
            {
              id: "1",
              text: "Each opponent chooses and discards a card.",
              responder: "opponent",
              effects: [
                {
                  type: "discard",
                  amount: 1,
                  target: {
                    type: "card",
                    value: 1,
                    filters: [
                      { filter: "zone", value: "hand" },
                      { filter: "owner", value: "self" },
                    ],
                  },
                },
              ],
            },
            {
              id: "2",
              text: "Chosen character gets +2 {S} this turn.",
              effects: [
                {
                  type: "attribute",
                  attribute: "strength",
                  amount: 2,
                  modifier: "add",
                  target: chosenCharacter,
                },
              ],
            },
            {
              id: "3",
              text: "Banish chosen damaged character.",
              effects: [
                {
                  type: "banish",
                  target: chosenDamagedCharacter,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  colors: ["emerald"],
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  illustrator: "Dylan Bonner / Celest Janmneck",
  number: 85,
  set: "SSK",
  rarity: "legendary",
};
