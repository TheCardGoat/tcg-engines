import type { CharacterCard } from "@tcg/op-types";
import { op16MonkeyDLuffy015I18n } from "./op16-015-monkey-d-luffy.i18n.ts";

export const op16MonkeyDLuffy015: CharacterCard = {
  id: "OP16-015",
  canonicalId: "OP16-015",
  slug: "monkey-d-luffy/op16-015",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "OP16-015",
      artId: "OP16-015",
      setCode: "OP16",
      collectorNumber: "015",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-015_c3IJUUv.jpg",
    },
    {
      id: "OP16-015_p1",
      artId: "OP16-015_p1",
      setCode: "OP16",
      collectorNumber: "015",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-015_p1_UT2z1HA.jpg",
      label: "Monkey.D.Luffy (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "OP16",
  cost: 4,
  power: 6000,
  traits: ["Straw Hat Crew Impel Down"],
  attribute: "strike",
  effect:
    "If your Leader's card name includes \"Ace\" and you have 6 or more DON!! cards on your field, give this card in your hand -2 cost. [On Your Opponent's Attack] You may trash 1 Character card with 8000 power from your hand: Your Leader and this Character's base power becomes 7000 during this turn.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "leaderName",
            name: "Portgas.D.Ace",
          },
          {
            condition: "donFieldCount",
            player: "self",
            comparison: "gte",
            value: 6,
          },
        ],
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
            value: -2,
            duration: "permanent",
          },
        ],
      },
    ],
    effects: [
      {
        trigger: "onOpponentAttack",
        optional: true,
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "cardCategory",
                value: "character",
              },
              {
                filter: "power",
                comparison: "eq",
                value: 8000,
              },
            ],
          },
        ],
        actions: [
          {
            action: "setBasePower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            value: 7000,
            duration: "thisTurn",
          },
          {
            action: "setBasePower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 7000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op16MonkeyDLuffy015I18n,
};
