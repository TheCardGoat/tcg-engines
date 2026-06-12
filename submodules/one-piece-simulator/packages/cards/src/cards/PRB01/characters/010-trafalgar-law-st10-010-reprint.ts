import type { CharacterCard } from "@tcg/op-types";
import { prb01TrafalgarLawSt10010Reprint010I18n } from "./010-trafalgar-law-st10-010-reprint.i18n.ts";

export const prb01TrafalgarLawSt10010Reprint010: CharacterCard = {
  id: "ST10-010",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "PRB01",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Heart Pirates"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST10-010_p4.jpg",
      imageId: "ST10-010_p4",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)[On Play] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): If your opponent has 7 or more cards in their hand, trash 2 cards from your opponent's hand.Disclaimer: This card was reprinted from the original set with changes to the artist credit (note the lack of pen symbol next to the artist name).",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "handCount",
            player: "opponent",
            comparison: "gte",
            value: 7,
          },
        ],
        costs: [
          {
            cost: "returnDon",
            amount: 1,
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
  i18n: prb01TrafalgarLawSt10010Reprint010I18n,
};
