import type { LeaderCard } from "@tcg/op-types";
import { st13PortgasDAce002I18n } from "./st13-002-portgas-d-ace.i18n.ts";
export const st13PortgasDAce002: LeaderCard = {
  id: "ST13-002",
  canonicalId: "ST13-002",
  slug: "portgas-d-ace/st13-002",
  name: "Portgas.D.Ace",
  printings: [
    {
      id: "ST13-002",
      artId: "ST13-002",
      setCode: "ST13",
      collectorNumber: "002",
      rarity: "L",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST13-002.png",
    },
  ],
  cardType: "leader",
  color: ["blue", "yellow"],
  rarity: "L",
  setId: "ST13",
  traits: ["Whitebeard Pirates"],
  life: 4,
  power: 5000,
  attribute: "special",
  effect:
    "[DON!! x2] [Activate: Main] [Once Per Turn] Look at 5 cards from the top of your deck and add up to 1 Character card with a cost of 5 to the top of your Life cards face-up. Then, place the rest at the bottom of your deck in any order. [End of Your Turn] Trash all your face-up Life cards.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
          },
        ],
        oncePerTurn: true,
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
                filter: "cardCategory",
                value: "character",
              },
              {
                filter: "cost",
                comparison: "eq",
                value: 5,
              },
            ],
            revealDestination: "life",
            lifeFaceUp: true,
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "endOfYourTurn",
        actions: [
          {
            action: "trashFromField",
            target: {
              player: "self",
              zones: ["life"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "faceUp",
                  value: true,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: st13PortgasDAce002I18n,
};
