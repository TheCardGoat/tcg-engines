import type { CharacterCard } from "@tcg/op-types";
import { st35Karasu003I18n } from "./st35-003-karasu.i18n.ts";
export const st35Karasu003: CharacterCard = {
  id: "ST35-003",
  canonicalId: "ST35-003",
  slug: "karasu/st35-003",
  name: "Karasu",
  printings: [
    {
      id: "ST35-003",
      artId: "ST35-003",
      setCode: "ST35",
      collectorNumber: "003",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST35-003.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "ST35",
  cost: 3,
  traits: ["Revolutionary Army"],
  power: 4000,
  attribute: "special",
  counter: 2000,
  effect:
    "[When Attacking] You may trash 2 cards from the top of your deck: If your opponent has 7 or more cards in their hand, your opponent trashes 1 card from their hand.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "deck",
            comparison: "gte",
            value: 2,
          },
        ],
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "opponent",
            amount: 1,
            condition: {
              condition: "handCount",
              player: "opponent",
              comparison: "gte",
              value: 7,
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st35Karasu003I18n,
};
