import type { CharacterCard } from "@tcg/op-types";
import { prb02JewelryBonneyPrb02004004I18n } from "./004-jewelry-bonney-prb02-004.i18n.ts";

export const prb02JewelryBonneyPrb02004004: CharacterCard = {
  id: "PRB02-004",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "PRB02",
  cost: 3,
  power: 3000,
  counter: 1000,
  traits: ["Bonney Pirates Supernovas"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB02-004_p1.jpg",
      imageId: "PRB02-004_p1",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)[On Your Opponent's Attack] [Once Per Turn] Set up to 1 of your DON!! cards as active.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onOpponentAttack",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: prb02JewelryBonneyPrb02004004I18n,
};
