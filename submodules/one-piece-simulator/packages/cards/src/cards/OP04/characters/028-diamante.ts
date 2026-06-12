import type { CharacterCard } from "@tcg/op-types";
import { op04Diamante028I18n } from "./028-diamante.i18n.ts";

export const op04Diamante028: CharacterCard = {
  id: "OP04-028",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP04",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-028_p1.jpg",
      imageId: "OP04-028_p1",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [DON!! x1] [End of Your Turn] If you have 2 or more active DON!! cards, set this Character as active.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "endOfYourTurn",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "donFieldCount",
            player: "self",
            comparison: "gte",
            value: 2,
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
          },
        ],
      },
    ],
  },
  i18n: op04Diamante028I18n,
};
