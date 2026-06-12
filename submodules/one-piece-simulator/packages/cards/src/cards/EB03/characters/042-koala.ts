import type { CharacterCard } from "@tcg/op-types";
import { eb03Koala042I18n } from "./042-koala.i18n.ts";

export const eb03Koala042: CharacterCard = {
  id: "EB03-042",
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "EB03",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Revolutionary Army Dressrosa"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-042_p2_9UP5kWW.jpg",
      imageId: "EB03-042_p2",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-042_p1_h9LKnFh.jpg",
      imageId: "EB03-042_p1",
    },
  ],
  effect:
    "If your Leader has the {Revolutionary Army} type, this Character gains +4 cost.\n[Opponent's Turn] [On K.O.] Play up to 1 {Revolutionary Army} type Character card with a cost of 6 or less other than [Koala] or up to 1 [Nico Robin] with a cost of 6 or less from your hand or trash.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: ["hand", "trash"],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "excludeName",
                value: "Koala",
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 6,
              },
              {
                filter: "trait",
                value: "Revolutionary Army",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: eb03Koala042I18n,
};
