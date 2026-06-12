import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Monet074I18n } from "./074-monet.i18n.ts";

export const op14eb04Monet074: CharacterCard = {
  id: "OP14-074",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Donquixote Pirates Punk Hazard"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-074_NPJNVno.jpg",
      imageId: "OP14-074",
    },
  ],
  effect:
    "[On Play] If your Leader has the {Donquixote Pirates} type, add up to 1 DON!! card from your DON!! deck and set it as active.\n[On K.O.] Draw 2 cards and trash 1 card from your hand. Then, add up to 2 DON!! cards from your DON!! deck and rest them.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Donquixote Pirates",
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
      },
      {
        trigger: "onKo",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
          {
            action: "addDon",
            count: {
              amount: 2,
              upTo: true,
            },
            state: "rested",
          },
        ],
      },
    ],
  },
  i18n: op14eb04Monet074I18n,
};
