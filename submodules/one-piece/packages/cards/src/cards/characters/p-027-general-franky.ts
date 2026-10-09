import type { CharacterCard } from "@tcg/op-types";
import { pGeneralFranky027I18n } from "./p-027-general-franky.i18n.ts";
export const pGeneralFranky027: CharacterCard = {
  id: "P-027",
  canonicalId: "P-027",
  slug: "general-franky/p-027",
  name: "General Franky",
  printings: [
    {
      id: "P-027",
      artId: "P-027",
      setCode: "P",
      collectorNumber: "027",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-027.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "P",
  setId: "P",
  cost: 2,
  power: 4000,
  traits: ["Straw Hat Crew"],
  attribute: "ranged",
  effect:
    "Also treat this card's name as [Franky] according to the rules. [Opponent's Turn] All of your Characters with 3000 base power or less gain +1000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
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
                  filter: "basePower",
                  comparison: "lte",
                  value: 3000,
                },
              ],
            },
            value: 1000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  alternateNames: ["Franky"],
  i18n: pGeneralFranky027I18n,
};
