import type { CharacterCard } from "@tcg/op-types";
import { op12MarshallDTeach054I18n } from "./054-marshall-d-teach.i18n.ts";

export const op12MarshallDTeach054: CharacterCard = {
  id: "OP12-054",
  canonicalId: "OP12-054",
  slug: "marshall-d-teach/op12-054",
  name: "Marshall.D.Teach",
  printings: [
    {
      id: "OP12-054",
      artId: "OP12-054",
      setCode: "OP12",
      collectorNumber: "054",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-054_cILrzBQ.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP12",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Blackbeard Pirates The Seven Warlords of the Sea"],
  attribute: "special",
  effect:
    '[On Play] If your Leader has the "The Seven Warlords of the Sea" type, return up to 1 Character with a cost of 1 or less other than this Character to the owner\'s hand.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "The Seven Warlords of the Sea",
            match: "includes",
          },
        ],
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
                  value: 1,
                },
                {
                  filter: "excludeSelf",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op12MarshallDTeach054I18n,
};
