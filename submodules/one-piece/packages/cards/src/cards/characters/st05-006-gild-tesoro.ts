import type { CharacterCard } from "@tcg/op-types";
import { st05GildTesoro006I18n } from "./st05-006-gild-tesoro.i18n.ts";

export const st05GildTesoro006: CharacterCard = {
  id: "ST05-006",
  canonicalId: "ST05-006",
  slug: "gild-tesoro/st05-006",
  name: "Gild Tesoro",
  printings: [
    {
      id: "ST05-006",
      artId: "ST05-006",
      setCode: "ST05",
      collectorNumber: "006",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST05-006.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "ST05",
  cost: 5,
  power: 6000,
  traits: ["FILM", "Grantesoro"],
  attribute: "special",
  effect:
    "[When Attacking] DON!! −2 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Draw 2 cards.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        costs: [
          {
            cost: "returnDon",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st05GildTesoro006I18n,
};
