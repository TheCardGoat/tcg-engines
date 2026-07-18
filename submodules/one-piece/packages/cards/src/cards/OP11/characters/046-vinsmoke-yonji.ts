import type { CharacterCard } from "@tcg/op-types";
import { op11VinsmokeYonji046I18n } from "./046-vinsmoke-yonji.i18n.ts";

export const op11VinsmokeYonji046: CharacterCard = {
  id: "OP11-046",
  canonicalId: "OP11-046",
  slug: "vinsmoke-yonji/op11-046",
  name: "Vinsmoke Yonji",
  printings: [
    {
      id: "OP11-046",
      artId: "OP11-046",
      setCode: "OP11",
      collectorNumber: "046",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-046.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP11",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["The Vinsmoke Family GERMA 66"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\nIf you only have Characters with a type including \"GERMA\", this Character cannot be K.O.'d or rested by your opponent's effects.",
  effects: {
    keywords: ["blocker"],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            comparison: "eq",
            value: 0,
            filters: [
              {
                filter: "trait",
                value: "GERMA",
                match: "includes",
                negate: true,
              },
            ],
          },
        ],
        actions: [
          {
            action: "cannotBeKod",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            duration: "permanent",
            restriction: "byEffect",
            byPlayer: "opponent",
          },
          {
            action: "cannotBeRested",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            duration: "permanent",
            byPlayer: "opponent",
          },
        ],
      },
    ],
  },
  i18n: op11VinsmokeYonji046I18n,
};
