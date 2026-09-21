import type { CharacterCard } from "@tcg/op-types";
import { op17Gerd081I18n } from "./op17-081-gerd.i18n.ts";

export const op17Gerd081: CharacterCard = {
  id: "OP17-081",
  canonicalId: "OP17-081",
  slug: "gerd/op17-081",
  name: "Gerd",
  printings: [
    {
      id: "OP17-081",
      artId: "OP17-081",
      setCode: "OP17",
      collectorNumber: "081",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-081_R6KeQy9.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP17",
  cost: 2,
  power: 3000,
  counter: 2000,
  traits: ["Giant Elbaph New Giant Pirates"],
  attribute: "slash",
  effect:
    "If your Leader has the {Elbaph} type, this Character gains +12 cost.\n[On Play] You may trash 1 card from your hand: Add up to 1 Character card with a cost of 8 or less other than [Gerd] from your trash to your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["trash"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cardCategory",
                  value: "character",
                },
                {
                  filter: "excludeName",
                  value: "Gerd",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 8,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Elbaph",
            match: "includes",
          },
        ],
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
  i18n: op17Gerd081I18n,
};
