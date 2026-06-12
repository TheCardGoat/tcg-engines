import type { CharacterCard } from "@tcg/op-types";
import { op12TrafalgarLaw073I18n } from "./073-trafalgar-law.i18n.ts";

export const op12TrafalgarLaw073: CharacterCard = {
  id: "OP12-073",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP12",
  cost: 7,
  power: 8000,
  traits: ["Heart Pirates Supernovas Dressrosa"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-073_p1_uy1gZ3D.jpg",
      imageId: "OP12-073_p1",
    },
  ],
  effect:
    "[On Play] If the number of DON!! cards on your field is equal to or less than the number on your opponent's field, add up to 1 DON!! card from your DON!! deck and set it as active. Then, all of your [Donquixote Rosinante] and \"Heart Pirates\" type Characters gain +1000 power until the end of your opponent's next End Phase.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "donFieldComparison",
            selfComparison: "lte",
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
      },
    ],
  },
  i18n: op12TrafalgarLaw073I18n,
};
