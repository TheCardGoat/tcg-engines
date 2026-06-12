import type { CharacterCard } from "@tcg/op-types";
import { op08CharlottePudding067I18n } from "./067-charlotte-pudding.i18n.ts";

export const op08CharlottePudding067: CharacterCard = {
  id: "OP08-067",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP08",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-067_p1.jpg",
      imageId: "OP08-067_p1",
    },
  ],
  effect:
    "[Your Turn] [Once Per Turn] When a DON!! card on your field is returned to your DON!! deck, add up to 1 DON!! card from your DON!! deck and rest it.",
  effects: {
    effects: [
      {
        trigger: "whenDonReturned",
        conditions: [
          {
            condition: "turn",
            value: "your",
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
        oncePerTurn: true,
      },
    ],
  },
  i18n: op08CharlottePudding067I18n,
};
