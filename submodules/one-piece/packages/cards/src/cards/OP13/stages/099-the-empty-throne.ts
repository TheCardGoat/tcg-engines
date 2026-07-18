import type { StageCard } from "@tcg/op-types";
import { op13TheEmptyThrone099I18n } from "./099-the-empty-throne.i18n.ts";

export const op13TheEmptyThrone099: StageCard = {
  id: "OP13-099",
  canonicalId: "OP13-099",
  slug: "the-empty-throne",
  name: "The Empty Throne",
  printings: [
    {
      id: "OP13-099",
      artId: "OP13-099",
      setCode: "OP13",
      collectorNumber: "099",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-099_2ZhUgA5.jpg",
    },
  ],
  cardType: "stage",
  color: ["black"],
  rarity: "C",
  setId: "OP13",
  cost: 7,
  traits: ["Mary Geoise"],
  effect:
    '[Your Turn] If you have 19 or more cards in your trash, your Leader gains +1000 power.\n[Activate: Main] You may rest this card and 3 of your DON!! cards: Play up to 1 black "Five Elders" type Character card with a cost equal to or less than the number of DON!! cards on your field from your hand.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
          {
            cost: "restDon",
            amount: 3,
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "dynamicCost",
                comparison: "lte",
                source: "selfDonCount",
              },
              {
                filter: "color",
                value: "black",
              },
              {
                filter: "trait",
                value: "Five Elders",
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
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
          {
            condition: "zoneCount",
            player: "self",
            zone: "trash",
            comparison: "gte",
            value: 19,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: "all",
              },
            },
            value: 1000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op13TheEmptyThrone099I18n,
};
