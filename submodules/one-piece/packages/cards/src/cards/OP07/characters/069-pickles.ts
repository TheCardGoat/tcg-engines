import type { CharacterCard } from "@tcg/op-types";
import { op07Pickles069I18n } from "./069-pickles.i18n.ts";

export const op07Pickles069: CharacterCard = {
  id: "OP07-069",
  canonicalId: "OP07-069",
  slug: "pickles",
  name: "Pickles",
  printings: [
    {
      id: "OP07-069",
      artId: "OP07-069",
      setCode: "OP07",
      collectorNumber: "069",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-069.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP07",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Foxy Pirates"],
  attribute: "strike",
  effect:
    "If the number of DON!! cards on your field is equal to or less than the number on your opponent's field, your [Foxy Pirates] type Characters other than [Pickles] cannot be K.O.'d by your opponent's effects.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donFieldComparison",
            selfComparison: "lte",
          },
        ],
        actions: [
          {
            action: "cannotBeKod",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: "all" },
              filters: [
                { filter: "trait", value: "Foxy Pirates", match: "includes" },
                { filter: "excludeName", value: "Pickles" },
              ],
            },
            duration: "permanent",
            restriction: "byEffect",
            byPlayer: "opponent",
          },
        ],
      },
    ],
  },
  i18n: op07Pickles069I18n,
};
