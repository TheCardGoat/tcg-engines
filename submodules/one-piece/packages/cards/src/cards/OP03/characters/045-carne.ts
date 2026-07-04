import type { CharacterCard } from "@tcg/op-types";
import { op03Carne045I18n } from "./045-carne.i18n.ts";

export const op03Carne045: CharacterCard = {
  id: "OP03-045",
  canonicalId: "OP03-045",
  slug: "carne/op03-045",
  name: "Carne",
  printings: [
    {
      id: "OP03-045",
      artId: "OP03-045",
      setCode: "OP03",
      collectorNumber: "045",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-045.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP03",
  cost: 3,
  power: 3000,
  counter: 1000,
  traits: ["East Blue"],
  attribute: "slash",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [Opponent's Turn] If you have 20 or less cards in your deck, this Character gains +3000 power.",
  effects: {
    keywords: ["blocker"],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
          {
            condition: "zoneCount",
            player: "self",
            zone: "deck",
            comparison: "lte",
            value: 20,
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
  i18n: op03Carne045I18n,
};
