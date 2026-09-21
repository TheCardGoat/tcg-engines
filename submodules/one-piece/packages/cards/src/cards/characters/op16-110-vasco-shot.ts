import type { CharacterCard } from "@tcg/op-types";
import { op16VascoShot110I18n } from "./op16-110-vasco-shot.i18n.ts";

export const op16VascoShot110: CharacterCard = {
  id: "OP16-110",
  canonicalId: "OP16-110",
  slug: "vasco-shot/op16-110",
  name: "Vasco Shot",
  printings: [
    {
      id: "OP16-110",
      artId: "OP16-110",
      setCode: "OP16",
      collectorNumber: "110",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-110_wWgHWkl.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP16",
  cost: 1,
  power: 2000,
  counter: 1000,
  trigger: "Activate this card's [On K.O.] effect.",
  traits: ["Blackbeard Pirates Impel Down"],
  attribute: "special",
  effect:
    "[On K.O.] Draw 1 card and rest up to 1 of your opponent's Characters with a cost of 6 or less.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "rest",
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
                  value: 6,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op16VascoShot110I18n,
};
