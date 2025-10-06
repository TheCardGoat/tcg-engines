import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const hadesDoubleDealer: LorcanitoCharacterCardDefinition = {
  id: "pib",
  missingTestCase: true,
  name: "Hades",
  title: "Double Dealer",
  characteristics: ["storyborn", "villain", "deity"],
  text: "**GET DOWN TO BUSINESS** {E},  Banish chosen character of yours - Play another character from your hand with the same name.",
  type: "character",
  abilities: [
    {
      type: "activated",
      name: "**GET DOWN TO BUSINESS** ",
      text: "{E},  Banish chosen character of yours - Play another character from your hand with the same name.",
      costs: [{ type: "exert" }],
      effects: [
        {
          type: "banish",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "zone", value: "play" },
              { filter: "type", value: "character" },
            ],
          },
          afterEffect: [
            {
              type: "create-layer-based-on-target",
              target: thisCharacter,
              effects: [
                {
                  type: "play",
                  forFree: true,
                  target: {
                    type: "card",
                    value: 1,
                    filters: [
                      { filter: "owner", value: "self" },
                      { filter: "zone", value: "hand" },
                      {
                        filter: "attribute",
                        value: "name",
                        compareWithParentsTarget: true,
                        comparison: { operator: "eq", value: "target" },
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  illustrator: "Alan Batson",
  number: 74,
  set: "URR",
  rarity: "legendary",
};
