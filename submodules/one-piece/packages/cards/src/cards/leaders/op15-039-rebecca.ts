import type { LeaderCard } from "@tcg/op-types";
import { op15Rebecca039I18n } from "./op15-039-rebecca.i18n.ts";

export const op15Rebecca039: LeaderCard = {
  id: "OP15-039",
  canonicalId: "OP15-039",
  slug: "rebecca/op15-039",
  name: "Rebecca",
  printings: [
    {
      id: "OP15-039",
      artId: "OP15-039",
      setCode: "OP15",
      collectorNumber: "039",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-039_Fpbv2Zo.jpg",
      label: "Rebecca (OP15-039)",
    },
    {
      id: "OP15-039_p1",
      artId: "OP15-039_p1",
      setCode: "OP15",
      collectorNumber: "039",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-039_p1_1RVSBD5.jpg",
      label: "Rebecca (OP15-039) (Alternate Art)",
    },
  ],
  cardType: "leader",
  color: ["blue"],
  rarity: "L",
  setId: "OP15",
  power: 5000,
  life: 5,
  traits: ["Dressrosa"],
  attribute: "wisdom",
  effect:
    "This Leader cannot attack.\n[Activate: Main] You may rest this Leader and return 1 of your {Dressrosa} type Characters to the owner's hand: Play up to 1 {Dressrosa} type Character card with a cost of 3 from your hand.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
          {
            cost: "returnCharacter",
            amount: 1,
            filters: [
              {
                filter: "trait",
                value: "Dressrosa",
                match: "includes",
              },
            ],
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
                filter: "cost",
                comparison: "eq",
                value: 3,
              },
              {
                filter: "trait",
                value: "Dressrosa",
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
            action: "cannotAttack",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              self: true,
            },
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op15Rebecca039I18n,
};
