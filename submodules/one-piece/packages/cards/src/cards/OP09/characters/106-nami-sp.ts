import type { CharacterCard } from "@tcg/op-types";
import { op09NamiSp106I18n } from "./106-nami-sp.i18n.ts";

export const op09NamiSp106: CharacterCard = {
  id: "OP08-106",
  canonicalId: "OP08-106",
  slug: "nami-sp/op08-106",
  name: "Nami (SP)",
  printings: [
    {
      id: "OP08-106",
      artId: "OP08-106",
      setCode: "OP09",
      collectorNumber: "106",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-106_p2.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "OP09",
  cost: 5,
  power: 5000,
  counter: 1000,
  trigger: "Activate this card's [On Play] effect.",
  traits: ["Straw Hat Crew Egghead"],
  attribute: "special",
  effect:
    "[On Play] You may trash 1 card with a [Trigger] from your hand: K.O. up to 1 of your opponent's Characters with a cost of 5 or less. Then, if you have 3 or less cards in your hand, draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op09NamiSp106I18n,
};
