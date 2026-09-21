import type { CharacterCard } from "@tcg/op-types";
import { op17Jinbe083I18n } from "./op17-083-jinbe.i18n.ts";

export const op17Jinbe083: CharacterCard = {
  id: "OP17-083",
  canonicalId: "OP17-083",
  slug: "jinbe/op17-083",
  name: "Jinbe",
  printings: [
    {
      id: "OP17-083",
      artId: "OP17-083",
      setCode: "OP17",
      collectorNumber: "083",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-083_8PyfqVM.jpg",
      label: "Jinbe (083)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP17",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Fish-Man Straw Hat Crew Elbaph"],
  attribute: "strike",
  effect:
    "If there is a Character with a cost of 12 or more, this Character gains [Blocker] and +3000 power.\n(After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
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
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "blocker",
            duration: "permanent",
          },
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
  i18n: op17Jinbe083I18n,
};
