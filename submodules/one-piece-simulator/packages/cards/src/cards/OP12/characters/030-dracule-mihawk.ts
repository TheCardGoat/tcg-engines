import type { CharacterCard } from "@tcg/op-types";
import { op12DraculeMihawk030I18n } from "./030-dracule-mihawk.i18n.ts";

export const op12DraculeMihawk030: CharacterCard = {
  id: "OP12-030",
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "OP12",
  cost: 8,
  power: 8000,
  traits: ["The Seven Warlords of the Sea Muggy Kingdom"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-030_p1_sjTWMp8.jpg",
      imageId: "OP12-030_p1",
    },
  ],
  effect:
    "[Blocker]\n[On Play] Set up to 4 of your DON!! cards as active. Then, you cannot play Character cards with a base cost of 7 or more during this turn.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 4,
                upTo: true,
              },
            },
          },
          {
            action: "playRestriction",
            restriction: "cannotPlay",
            filters: [
              {
                filter: "cardCategory",
                value: "character",
              },
              {
                filter: "baseCost",
                comparison: "gte",
                value: 7,
              },
            ],
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op12DraculeMihawk030I18n,
};
