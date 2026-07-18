import type { CharacterCard } from "@tcg/op-types";
import { op03Zeff047I18n } from "./047-zeff.i18n.ts";

export const op03Zeff047: CharacterCard = {
  id: "OP03-047",
  canonicalId: "OP03-047",
  slug: "zeff/op03-047",
  name: "Zeff",
  printings: [
    {
      id: "OP03-047",
      artId: "OP03-047",
      setCode: "OP03",
      collectorNumber: "047",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-047.jpg",
    },
    {
      id: "OP03-047_p1",
      artId: "OP03-047_p1",
      setCode: "OP03",
      collectorNumber: "047",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-047_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP03",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["East Blue"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-047_p1.jpg",
      imageId: "OP03-047_p1",
    },
  ],
  effect:
    "[DON!! x1] When this Character's attack deals damage to your opponent's Life, you may trash 7 cards from the top of your deck.\n[On Play] Return up to 1 Character with a cost of 3 or less to the owner's hand, and you may trash 2 cards from the top of your deck.",
  effects: {
    effects: [
      {
        trigger: "whenDealsDamage",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 7,
          },
        ],
        optional: true,
      },
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "any",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
          },
          {
            action: "optional",
            actions: [
              {
                action: "trashFromDeck",
                player: "self",
                amount: 2,
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op03Zeff047I18n,
};
