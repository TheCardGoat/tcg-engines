import type { LeaderCard } from "@tcg/op-types";
import { op09Lim022I18n } from "./022-lim.i18n.ts";

export const op09Lim022: LeaderCard = {
  id: "OP09-022",
  canonicalId: "OP09-022",
  slug: "lim/op09-022",
  name: "Lim",
  printings: [
    {
      id: "OP09-022",
      artId: "OP09-022",
      setCode: "OP09",
      collectorNumber: "022",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-022.jpg",
    },
    {
      id: "OP09-022_p1",
      artId: "OP09-022_p1",
      setCode: "OP09",
      collectorNumber: "022",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-022_p1.jpg",
    },
  ],
  cardType: "leader",
  color: ["green", "purple"],
  rarity: "L",
  setId: "OP09",
  power: 5000,
  life: 4,
  traits: ["ODYSSEY"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-022_p1.jpg",
      imageId: "OP09-022_p1",
    },
  ],
  effect:
    'Your Character cards are played rested.\n[Activate: Main] [Once Per Turn] You may rest 3 of your DON!! cards: Add up to 1 DON!! card from your DON!! deck and rest it, and play up to 1 "ODYSSEY" type Character card with a cost of 5 or less from your hand.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [{ cost: "restDon", amount: 3 }],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
          {
            action: "play",
            source: { player: "self", zone: "hand" },
            count: { amount: 1, upTo: true },
            filters: [
              { filter: "cardCategory", value: "character" },
              { filter: "trait", value: "ODYSSEY", match: "includes" },
              { filter: "cost", comparison: "lte", value: 5 },
            ],
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
    permanentEffects: [
      {
        actions: [
          {
            action: "playRested",
            player: "self",
            filters: [{ filter: "cardCategory", value: "character" }],
          },
        ],
      },
    ],
  },
  i18n: op09Lim022I18n,
};
