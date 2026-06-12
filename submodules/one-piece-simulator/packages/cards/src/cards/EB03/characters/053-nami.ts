import type { CharacterCard } from "@tcg/op-types";
import { eb03Nami053I18n } from "./053-nami.i18n.ts";

export const eb03Nami053: CharacterCard = {
  id: "EB03-053",
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "EB03",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-053_p2_5xa1OeQ.jpg",
      imageId: "EB03-053_p2",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-053_p1_DxUHBvc.jpg",
      imageId: "EB03-053_p1",
    },
  ],
  effect:
    "[On Play] Give up to 1 rested DON!! card to your Leader. Then, if your opponent has 3 or more Life cards, add up to 1 card from the top of your opponent's Life cards to the owner's hand.\n[On K.O.] You may turn 1 card from the top of your Life cards face-up: Play up to 1 Character card with 6000 power or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
      },
      {
        trigger: "onKo",
        costs: [
          {
            cost: "turnLifeFaceUp",
            count: 1,
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "power",
                comparison: "lte",
                value: 6000,
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb03Nami053I18n,
};
