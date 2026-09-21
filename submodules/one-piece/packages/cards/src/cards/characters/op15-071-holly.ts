import type { CharacterCard } from "@tcg/op-types";
import { op15Holly071I18n } from "./op15-071-holly.i18n.ts";

export const op15Holly071: CharacterCard = {
  id: "OP15-071",
  canonicalId: "OP15-071",
  slug: "holly/op15-071",
  name: "Holly",
  printings: [
    {
      id: "OP15-071",
      artId: "OP15-071",
      setCode: "OP15",
      collectorNumber: "071",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-071_6gGIXlN.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP15",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Animal Sky Island"],
  attribute: "strike",
  effect:
    "All of your [Ohm] cards and this Character gain [Double Attack].\n(This card deals 2 damage.)\n[Opponent's Turn] All of your [Ohm] cards' base power and this Character's base power become 6000.",
  effects: {
    permanentEffects: [
      {
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "name",
                  value: "Ohm",
                },
              ],
            },
            keyword: "doubleAttack",
            duration: "permanent",
          },
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "doubleAttack",
            duration: "permanent",
          },
        ],
      },
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        actions: [
          {
            action: "setBasePower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "name",
                  value: "Ohm",
                },
              ],
            },
            value: 6000,
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
            value: 6000,
          },
        ],
      },
    ],
  },
  i18n: op15Holly071I18n,
};
