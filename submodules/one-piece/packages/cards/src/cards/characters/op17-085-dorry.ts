import type { CharacterCard } from "@tcg/op-types";
import { op17Dorry085I18n } from "./op17-085-dorry.i18n.ts";

export const op17Dorry085: CharacterCard = {
  id: "OP17-085",
  canonicalId: "OP17-085",
  slug: "dorry/op17-085",
  name: "Dorry",
  printings: [
    {
      id: "OP17-085",
      artId: "OP17-085",
      setCode: "OP17",
      collectorNumber: "085",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-085_MtazkSb.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP17",
  cost: 5,
  power: 5000,
  counter: 1000,
  traits: ["Giant Elbaph Giant Pirates"],
  attribute: "slash",
  effect:
    "This Character gains +12 cost.\n[On Play] If your Leader has the {Elbaph} type, play up to 1 [Brogy] with a cost of 5 or less from your hand or trash. Then, you cannot play Character cards during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Elbaph",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: ["hand", "trash"],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "lte",
                value: 5,
              },
              {
                filter: "name",
                value: "Brogy",
              },
            ],
          },
          {
            action: "playRestriction",
            restriction: "cannotPlay",
            filters: [
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            duration: "thisTurn",
          },
        ],
      },
    ],
    permanentEffects: [
      {
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 12,
          },
        ],
      },
    ],
  },
  i18n: op17Dorry085I18n,
};
