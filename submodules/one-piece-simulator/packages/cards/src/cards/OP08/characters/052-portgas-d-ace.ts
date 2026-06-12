import type { CharacterCard } from "@tcg/op-types";
import { op08PortgasDAce052I18n } from "./052-portgas-d-ace.i18n.ts";

export const op08PortgasDAce052: CharacterCard = {
  id: "OP08-052",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP08",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-052_p1.jpg",
      imageId: "OP08-052_p1",
    },
  ],
  effect:
    '[On Play] Reveal 1 card from the top of your deck and play up to 1 Character card with a type including "Whitebeard Pirates" and a cost of 4 or less. Then, place the rest at the top or bottom of your deck.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 1,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 1,
              upTo: true,
            },
            revealDestination: "character",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op08PortgasDAce052I18n,
};
