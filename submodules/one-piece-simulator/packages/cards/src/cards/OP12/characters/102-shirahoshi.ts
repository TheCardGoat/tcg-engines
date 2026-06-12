import type { CharacterCard } from "@tcg/op-types";
import { op12Shirahoshi102I18n } from "./102-shirahoshi.i18n.ts";

export const op12Shirahoshi102: CharacterCard = {
  id: "OP12-102",
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "OP12",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["Merfolk Fish-Man Island"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-102_p1_84QjuiK.jpg",
      imageId: "OP12-102_p1",
    },
  ],
  effect:
    "If your Character with a base cost of 6 or less would be removed from the field by your opponent's effect, you may turn 1 card from the top of your Life cards face-up instead.[Opponent's Turn] If you have no other [Shirahoshi] with a base cost of 2, all of your \"Neptunian\" type Characters gain +2000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
          {
            condition: "notHasCard",
            player: "self",
            zone: "field",
            filters: [
              {
                filter: "name",
                value: "Shirahoshi",
              },
              {
                filter: "baseCost",
                comparison: "eq",
                value: 2,
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "trait",
                  value: "Neptunian",
                },
              ],
            },
            value: 2000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op12Shirahoshi102I18n,
};
