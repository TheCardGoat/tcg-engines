import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Giolla064I18n } from "./064-giolla.i18n.ts";

export const op14eb04Giolla064: CharacterCard = {
  id: "OP14-064",
  canonicalId: "OP14-064",
  slug: "giolla/op14-064",
  name: "Giolla",
  printings: [
    {
      id: "OP14-064",
      artId: "OP14-064",
      setCode: "OP14EB04",
      collectorNumber: "064",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-064_v0ZYeCg.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 3,
  power: 1000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  effect:
    "[On K.O.] Add up to 1 DON!! card from your DON!! deck and rest it. Then, K.O. up to 1 of your opponent's Characters with a base power of 0.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
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
                  filter: "basePower",
                  comparison: "eq",
                  value: 0,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op14eb04Giolla064I18n,
};
