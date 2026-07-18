import type { LeaderCard } from "@tcg/op-types";
import { op11Jinbe021I18n } from "./021-jinbe.i18n.ts";

export const op11Jinbe021: LeaderCard = {
  id: "OP11-021",
  canonicalId: "OP11-021",
  slug: "jinbe/op11-021",
  name: "Jinbe",
  printings: [
    {
      id: "OP11-021",
      artId: "OP11-021",
      setCode: "OP11",
      collectorNumber: "021",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-021.jpg",
    },
    {
      id: "OP11-021_p1",
      artId: "OP11-021_p1",
      setCode: "OP11",
      collectorNumber: "021",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-021_p1.jpg",
    },
  ],
  cardType: "leader",
  color: ["green"],
  rarity: "L",
  setId: "OP11",
  power: 5000,
  life: 5,
  traits: ["Fish-Man Straw Hat Crew"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-021_p1.jpg",
      imageId: "OP11-021_p1",
    },
  ],
  effect:
    '[End of Your Turn] If you have 6 or less cards in your hand, set up to 1 of your "Fish-Man" or "Merfolk" type Characters and up to 1 of your DON!! cards as active.',
  effects: {
    effects: [
      {
        trigger: "endOfYourTurn",
        conditions: [{ condition: "handCount", player: "self", comparison: "lte", value: 6 }],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: 1, upTo: true },
              filters: [
                {
                  filter: "anyOf",
                  groups: [
                    [{ filter: "trait", value: "Fish-Man", match: "includes" }],
                    [{ filter: "trait", value: "Merfolk", match: "includes" }],
                  ],
                },
              ],
            },
          },
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: { amount: 1, upTo: true },
            },
          },
        ],
      },
    ],
  },
  i18n: op11Jinbe021I18n,
};
