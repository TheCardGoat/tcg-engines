import type { CharacterCard } from "@tcg/op-types";
import { pUta031I18n } from "./p-031-uta.i18n.ts";
export const pUta031: CharacterCard = {
  id: "P-031",
  canonicalId: "P-031",
  slug: "uta/p-031",
  name: "Uta",
  printings: [
    {
      id: "P-031",
      artId: "P-031",
      setCode: "P",
      collectorNumber: "031",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-031.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "P",
  setId: "P",
  cost: 5,
  power: 6000,
  traits: ["FILM"],
  attribute: "special",
  effect: "[On Play] Add up to 1 DON!! card from your DON!! deck and rest it.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
      },
    ],
  },
  i18n: pUta031I18n,
};
