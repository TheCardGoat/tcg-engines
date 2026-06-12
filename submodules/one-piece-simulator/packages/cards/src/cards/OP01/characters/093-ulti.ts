import type { CharacterCard } from "@tcg/op-types";
import { op01Ulti093I18n } from "./093-ulti.i18n.ts";

export const op01Ulti093: CharacterCard = {
  id: "OP01-093",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP01",
  cost: 2,
  power: 3000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "strike",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-093_p1.jpg",
      imageId: "OP01-093_p1",
    },
  ],
  effect:
    "[On Play] (1) (You may rest the specified number of DON!! cards in your cost area.): Add up to 1 DON!! card from your DON!! deck and rest it.  This card has been officially errata'd.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "restDon",
            amount: 1,
          },
        ],
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
  i18n: op01Ulti093I18n,
};
