import type { CharacterCard } from "@tcg/op-types";
import { eb03VinsmokeReiju031I18n } from "./031-vinsmoke-reiju.i18n.ts";

export const eb03VinsmokeReiju031: CharacterCard = {
  id: "EB03-031",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "EB03",
  cost: 5,
  power: 5000,
  counter: 1000,
  traits: ["The Vinsmoke Family GERMA 66"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-031_p2_x7r9oMT.jpg",
      imageId: "EB03-031_p2",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-031_p1_5nabW5C.jpg",
      imageId: "EB03-031_p1",
    },
  ],
  effect:
    "[Your Turn] [On Play] DON!! 1: If your Leader is [Sanji], activate the [Main] effect of up to 1 Event card with a cost of 7 or less in your trash.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
          {
            condition: "leaderName",
            name: "Sanji",
          },
        ],
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "activateEffect",
            effectTrigger: "main",
          },
        ],
      },
    ],
  },
  i18n: eb03VinsmokeReiju031I18n,
};
