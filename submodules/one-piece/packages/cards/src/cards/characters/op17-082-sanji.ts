import type { CharacterCard } from "@tcg/op-types";
import { op17Sanji082I18n } from "./op17-082-sanji.i18n.ts";

export const op17Sanji082: CharacterCard = {
  id: "OP17-082",
  canonicalId: "OP17-082",
  slug: "sanji/op17-082",
  name: "Sanji",
  printings: [
    {
      id: "OP17-082",
      artId: "OP17-082",
      setCode: "OP17",
      collectorNumber: "082",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-082_OkH7zEG.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP17",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Straw Hat Crew Elbaph"],
  attribute: "strike",
  effect:
    "If there is a Character with a cost of 12 or more, this Character gains +3000 power.\n[On Play] Draw 2 cards and trash 2 cards from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "existsOnField",
            zone: "character",
            filters: [
              {
                filter: "cost",
                comparison: "gte",
                value: 12,
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 3000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op17Sanji082I18n,
};
