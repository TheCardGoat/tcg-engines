import type { CharacterCard } from "@tcg/op-types";
import { op15PiratesDockingSix088I18n } from "./op15-088-pirates-docking-six.i18n.ts";

export const op15PiratesDockingSix088: CharacterCard = {
  id: "OP15-088",
  canonicalId: "OP15-088",
  slug: "pirates-docking-six/op15-088",
  name: "Pirates Docking Six",
  printings: [
    {
      id: "OP15-088",
      artId: "OP15-088",
      setCode: "OP15",
      collectorNumber: "088",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-088_Y6huCMS.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP15",
  cost: 5,
  power: 7000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  effect:
    "This Character gains +6 cost.\n[On Play] You may trash 3 cards from the top of your deck: Play up to 1 {Straw Hat Crew} type Character card with a cost of 2 or less from your trash.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "deck",
            comparison: "gte",
            value: 3,
          },
        ],
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 3,
          },
          {
            action: "play",
            source: {
              player: "self",
              zone: "trash",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "lte",
                value: 2,
              },
              {
                filter: "trait",
                value: "Straw Hat Crew",
                match: "includes",
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
    permanentEffects: [
      {
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["hand", "character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 6,
          },
        ],
      },
    ],
  },
  i18n: op15PiratesDockingSix088I18n,
};
