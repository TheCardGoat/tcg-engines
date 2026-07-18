import type { CharacterCard } from "@tcg/op-types";
import { op08Namule050I18n } from "./050-namule.i18n.ts";

export const op08Namule050: CharacterCard = {
  id: "OP08-050",
  canonicalId: "OP08-050",
  slug: "namule/op08-050",
  name: "Namule",
  printings: [
    {
      id: "OP08-050",
      artId: "OP08-050",
      setCode: "OP08",
      collectorNumber: "050",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-050.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP08",
  cost: 3,
  power: 2000,
  counter: 1000,
  traits: ["Fish-Man Whitebeard Pirates"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] Draw 2 cards and place 2 cards from your hand at the top or bottom of your deck in any order.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "returnToDeck",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 2,
              },
            },
            position: "any",
            order: "any",
          },
        ],
      },
    ],
  },
  i18n: op08Namule050I18n,
};
