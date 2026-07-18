import type { CharacterCard } from "@tcg/op-types";
import { op07Pappag030I18n } from "./030-pappag.i18n.ts";

export const op07Pappag030: CharacterCard = {
  id: "OP07-030",
  canonicalId: "OP07-030",
  slug: "pappag/op07-030",
  name: "Pappag",
  printings: [
    {
      id: "OP07-030",
      artId: "OP07-030",
      setCode: "OP07",
      collectorNumber: "030",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-030.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP07",
  cost: 2,
  power: 0,
  counter: 2000,
  traits: ["Animal"],
  attribute: "wisdom",
  effect:
    "If you have a [Camie] Character, this Character gains [Blocker]. (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "hasCard",
            player: "self",
            zone: "character",
            filters: [{ filter: "name", value: "Camie" }],
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: 1 },
              self: true,
            },
            keyword: "blocker",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op07Pappag030I18n,
};
