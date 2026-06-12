import type { CharacterCard } from "@tcg/op-types";
import { op03Paulie066I18n } from "./066-paulie.i18n.ts";

export const op03Paulie066: CharacterCard = {
  id: "OP03-066",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP03",
  cost: 5,
  power: 6000,
  traits: ["Galley-La Company Water Seven"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-066_p1.jpg",
      imageId: "OP03-066_p1",
    },
  ],
  effect:
    "[On Play] (2) (You may rest the specified number of DON!! cards in your cost area.): Add up to 1 DON!! card from your DON!! deck and set it as active. Then, if you have 8 or more DON!! cards on your field, K.O. up to 1 of your opponent's Characters with a cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "restDon",
            amount: 2,
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
  i18n: op03Paulie066I18n,
};
