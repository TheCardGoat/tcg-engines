import type { CharacterCard } from "@tcg/op-types";
import { op15CharlotteLola082I18n } from "./op15-082-charlotte-lola.i18n.ts";

export const op15CharlotteLola082: CharacterCard = {
  id: "OP15-082",
  canonicalId: "OP15-082",
  slug: "charlotte-lola/op15-082",
  name: "Charlotte Lola",
  printings: [
    {
      id: "OP15-082",
      artId: "OP15-082",
      setCode: "OP15",
      collectorNumber: "082",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-082_tXI2sio.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP15",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Rolling Pirates"],
  attribute: "slash",
  effect:
    "[On Play] Trash 3 cards from the top of your deck.\n[On K.O.] Add up to 1 of your Character cards with a cost of 8 or less from your trash to your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 3,
          },
        ],
      },
      {
        trigger: "onKo",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["trash"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "cardCategory",
                  value: "character",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 8,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op15CharlotteLola082I18n,
};
