import type { CharacterCard } from "@tcg/op-types";
import { op16Laffitte114I18n } from "./op16-114-laffitte.i18n.ts";

export const op16Laffitte114: CharacterCard = {
  id: "OP16-114",
  canonicalId: "OP16-114",
  slug: "laffitte/op16-114",
  name: "Laffitte",
  printings: [
    {
      id: "OP16-114",
      artId: "OP16-114",
      setCode: "OP16",
      collectorNumber: "114",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-114_L7LmU31.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP16",
  cost: 1,
  power: 2000,
  counter: 1000,
  trigger: "Activate this card's [On K.O.] effect.",
  traits: ["Blackbeard Pirates"],
  attribute: "strike",
  effect: "[On K.O.] K.O. up to 1 of your opponent's Characters with a cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "onKo",
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
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op16Laffitte114I18n,
};
