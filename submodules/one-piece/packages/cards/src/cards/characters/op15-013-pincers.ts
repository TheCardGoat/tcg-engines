import type { CharacterCard } from "@tcg/op-types";
import { op15Pincers013I18n } from "./op15-013-pincers.i18n.ts";

export const op15Pincers013: CharacterCard = {
  id: "OP15-013",
  canonicalId: "OP15-013",
  slug: "pincers/op15-013",
  name: "Pincers",
  printings: [
    {
      id: "OP15-013",
      artId: "OP15-013",
      setCode: "OP15",
      collectorNumber: "013",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-013_zQ7rphD.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP15",
  cost: 4,
  power: 2000,
  counter: 2000,
  traits: ["Animal Alabasta"],
  attribute: "strike",
  effect:
    "If your Leader has 0 power or less, give this card in your hand -2 cost.\n[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "hasCard",
            player: "self",
            zone: "leader",
            filters: [
              {
                filter: "power",
                comparison: "lte",
                value: 0,
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
            value: -2,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op15Pincers013I18n,
};
