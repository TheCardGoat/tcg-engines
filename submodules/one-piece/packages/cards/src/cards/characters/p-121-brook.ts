import type { CharacterCard } from "@tcg/op-types";
import { pBrook121I18n } from "./p-121-brook.i18n.ts";
export const pBrook121: CharacterCard = {
  id: "P-121",
  canonicalId: "P-121",
  slug: "brook/p-121",
  name: "Brook",
  printings: [
    {
      id: "P-121",
      artId: "P-121",
      setCode: "P",
      collectorNumber: "121",
      rarity: "P",
      imageUrl: "https://asia-en.onepiece-cardgame.com/images/cardlist/card/P-121.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "P",
  setId: "P",
  cost: 4,
  power: 5000,
  counter: 1000,
  attribute: "slash",
  traits: ["Straw Hat Crew"],
  effect:
    "[On Play] Trash 3 cards from the top of your deck. [On K.O.] Your opponent trashes 2 cards from their hand.",
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
            action: "trashFromHand",
            player: "opponent",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: pBrook121I18n,
};
