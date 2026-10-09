import type { StageCard } from "@tcg/op-types";
import { st31ThousandSunny005I18n } from "./st31-005-thousand-sunny.i18n.ts";
export const st31ThousandSunny005: StageCard = {
  id: "ST31-005",
  canonicalId: "ST31-005",
  slug: "thousand-sunny/st31-005",
  name: "Thousand Sunny",
  printings: [
    {
      id: "ST31-005",
      artId: "ST31-005",
      setCode: "ST31",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST31-005.png",
    },
  ],
  cardType: "stage",
  color: ["red"],
  rarity: "C",
  setId: "ST31",
  cost: 1,
  traits: ["Straw Hat Crew"],
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 {Straw Hat Crew} type card and add it to your hand. Then, place the rest at the bottom of your deck in any order. [Activate: Main] You may rest this Stage: Give up to 1 rested DON!! card to 1 of your [Monkey.D.Luffy] cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 5,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 1,
              upTo: true,
            },
            revealFilters: [
              {
                filter: "trait",
                value: "Straw Hat Crew",
                match: "exact",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character", "stage", "costArea"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "name",
                  value: "Monkey.D.Luffy",
                },
              ],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st31ThousandSunny005I18n,
};
