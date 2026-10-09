import type { CharacterCard } from "@tcg/op-types";
import { st23Uta001I18n } from "./st23-001-uta.i18n.ts";
export const st23Uta001: CharacterCard = {
  id: "ST23-001",
  canonicalId: "ST23-001",
  slug: "uta/st23-001",
  name: "Uta",
  printings: [
    {
      id: "ST23-001",
      artId: "ST23-001",
      setCode: "ST23",
      collectorNumber: "001",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST23-001.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "ST23",
  cost: 6,
  traits: ["FILM"],
  power: 4000,
  attribute: "special",
  counter: 2000,
  effect:
    "If you have a Character with 10000 power or more, give this card in your hand −4 cost. [Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "hasCard",
            player: "self",
            zone: "character",
            filters: [
              {
                filter: "power",
                comparison: "gte",
                value: 10000,
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: -4,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: st23Uta001I18n,
};
