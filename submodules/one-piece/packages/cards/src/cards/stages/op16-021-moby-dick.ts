import type { StageCard } from "@tcg/op-types";
import { op16MobyDick021I18n } from "./op16-021-moby-dick.i18n.ts";

export const op16MobyDick021: StageCard = {
  id: "OP16-021",
  canonicalId: "OP16-021",
  slug: "moby-dick/op16-021",
  name: "Moby Dick",
  printings: [
    {
      id: "OP16-021",
      artId: "OP16-021",
      setCode: "OP16",
      collectorNumber: "021",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-021_N1g78JS.jpg",
    },
    {
      id: "OP16-021_p1",
      artId: "OP16-021_p1",
      setCode: "OP16",
      collectorNumber: "021",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-021_p1_siWi8dK.jpg",
      label: "Moby Dick (Alternate Art)",
    },
  ],
  cardType: "stage",
  color: ["red"],
  rarity: "R",
  setId: "OP16",
  cost: 1,
  traits: ["Whitebeard Pirates"],
  effect:
    "[On Play] If your Leader has the {Whitebeard Pirates} type, look at 3 cards from the top of your deck and add up to 1 card to your hand. Then, place the rest at the bottom of your deck in any order.  [Activate:Main] You may trash this Stage: Give up to 1 rested DON!! card to your Leader or 1 of your Characters.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Whitebeard Pirates",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "search",
            lookCount: 3,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 1,
              upTo: true,
            },
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
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
        optional: true,
      },
    ],
  },
  i18n: op16MobyDick021I18n,
};
