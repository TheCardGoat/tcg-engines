import type { CharacterCard } from "@tcg/op-types";
import { op05XDrake055I18n } from "./055-x-drake.i18n.ts";

export const op05XDrake055: CharacterCard = {
  id: "OP05-055",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP05",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates Drake Pirates Navy"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-055_p1.jpg",
      imageId: "OP05-055_p1",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] Look at 5 cards from the top of your deck and place them at the top or bottom of the deck in any order.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rearrangeDeck",
            player: "self",
            count: 5,
            position: "topOrBottom",
          },
        ],
      },
    ],
  },
  i18n: op05XDrake055I18n,
};
