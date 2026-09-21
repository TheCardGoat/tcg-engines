import type { CharacterCard } from "@tcg/op-types";
import { op17Hongo029I18n } from "./op17-029-hongo.i18n.ts";

export const op17Hongo029: CharacterCard = {
  id: "OP17-029",
  canonicalId: "OP17-029",
  slug: "hongo/op17-029",
  name: "Hongo",
  printings: [
    {
      id: "OP17-029",
      artId: "OP17-029",
      setCode: "OP17",
      collectorNumber: "029",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-029_RmvOBJR.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP17",
  cost: 4,
  power: 4000,
  counter: 2000,
  traits: ["Red-Haired Pirates"],
  attribute: "strike",
  effect:
    "[Blocker]\n[On Play] Set up to 1 of your DON!! cards as active. Then, rest up to 2 of your opponent's Characters with a cost of 2 or less.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 2,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op17Hongo029I18n,
};
