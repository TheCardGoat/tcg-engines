import type { CharacterCard } from "@tcg/op-types";
import { op06Inazuma002I18n } from "./002-inazuma.i18n.ts";

export const op06Inazuma002: CharacterCard = {
  id: "OP06-002",
  canonicalId: "OP06-002",
  slug: "inazuma/op06-002",
  name: "Inazuma",
  printings: [
    {
      id: "OP06-002",
      artId: "OP06-002",
      setCode: "OP06",
      collectorNumber: "002",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-002.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP06",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Revolutionary Army"],
  attribute: "slash",
  effect:
    "If this Character has 7000 power or more, this Character gains [Banish].\n(When this card deals damage, the target card is trashed without activating its Trigger.)",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "cardState",
            target: "this",
            property: "power",
            comparison: "gte",
            value: 7000,
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: { player: "self", zones: ["character"], count: { amount: 1 }, self: true },
            keyword: "banish",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op06Inazuma002I18n,
};
