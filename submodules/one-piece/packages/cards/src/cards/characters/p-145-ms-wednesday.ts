import type { CharacterCard } from "@tcg/op-types";
import { pMsWednesday145I18n } from "./p-145-ms-wednesday.i18n.ts";
export const pMsWednesday145: CharacterCard = {
  id: "P-145",
  canonicalId: "P-145",
  slug: "ms-wednesday/p-145",
  name: "Ms. Wednesday",
  printings: [
    {
      id: "P-145",
      artId: "P-145",
      setCode: "P",
      collectorNumber: "145",
      rarity: "P",
      imageUrl: "https://asia-en.onepiece-cardgame.com/images/cardlist/card/P-145.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "P",
  setId: "P",
  cost: 4,
  traits: ["Baroque Works"],
  power: 5000,
  attribute: "slash",
  counter: 1000,
  effect:
    "[On Play] Draw 1 card and trash 1 card from your hand. [On K.O.] If your opponent has 6 or more cards in their hand, your opponent trashes 2 card from their hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "handCount",
            player: "opponent",
            comparison: "gte",
            value: 6,
          },
        ],
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
  i18n: pMsWednesday145I18n,
};
