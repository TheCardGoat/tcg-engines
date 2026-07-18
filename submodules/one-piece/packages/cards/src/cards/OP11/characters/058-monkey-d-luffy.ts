import type { CharacterCard } from "@tcg/op-types";
import { op11MonkeyDLuffy058I18n } from "./058-monkey-d-luffy.i18n.ts";

export const op11MonkeyDLuffy058: CharacterCard = {
  id: "OP11-058",
  canonicalId: "OP11-058",
  slug: "monkey-d-luffy/op11-058",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "OP11-058",
      artId: "OP11-058",
      setCode: "OP11",
      collectorNumber: "058",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-058.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP11",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  effect:
    "If you have 5 or more cards in your hand, this Character cannot attack.\n[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "handCount",
            player: "self",
            comparison: "gte",
            value: 5,
          },
        ],
        actions: [
          {
            action: "cannotAttack",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op11MonkeyDLuffy058I18n,
};
