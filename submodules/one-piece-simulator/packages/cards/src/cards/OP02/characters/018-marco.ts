import type { CharacterCard } from "@tcg/op-types";
import { op02Marco018I18n } from "./018-marco.i18n.ts";

export const op02Marco018: CharacterCard = {
  id: "OP02-018",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP02",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-018_p1.jpg",
      imageId: "OP02-018_p1",
    },
  ],
  effect:
    '[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On K.O.] You may trash 1 card with a type including "Whitebeard Pirates" from your hand: If you have 2 or less Life cards, play this Character card from your trash rested.',
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 2,
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "trash",
            },
            count: {
              amount: 1,
            },
            playState: "rested",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op02Marco018I18n,
};
