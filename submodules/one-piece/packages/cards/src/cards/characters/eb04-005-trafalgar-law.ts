import type { CharacterCard } from "@tcg/op-types";
import { eb04TrafalgarLaw005I18n } from "./eb04-005-trafalgar-law.i18n.ts";

export const eb04TrafalgarLaw005: CharacterCard = {
  id: "EB04-005",
  canonicalId: "EB04-005",
  slug: "trafalgar-law/eb04-005",
  name: "Trafalgar Law",
  printings: [
    {
      id: "EB04-005",
      artId: "EB04-005",
      setCode: "EB04",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-005_3PAWn8I.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "EB04",
  cost: 3,
  power: 5000,
  counter: 2000,
  traits: ["Heart Pirates Supernovas The Seven Warlords of the Sea"],
  attribute: "slash",
  effect:
    "This Character cannot attack unless your opponent has 2 or more Characters with a base power of 5000 or more.",
  effects: {
    permanentEffects: [
      {
        actions: [
          {
            action: "cannotAttack",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: 1 },
              self: true,
            },
            duration: "permanent",
            condition: {
              condition: "zoneCount",
              player: "opponent",
              zone: "character",
              comparison: "lte",
              value: 1,
              filters: [
                {
                  filter: "basePower",
                  comparison: "gte",
                  value: 5000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: eb04TrafalgarLaw005I18n,
};
