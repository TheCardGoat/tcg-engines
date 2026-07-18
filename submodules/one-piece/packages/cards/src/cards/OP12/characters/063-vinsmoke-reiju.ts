import type { CharacterCard } from "@tcg/op-types";
import { op12VinsmokeReiju063I18n } from "./063-vinsmoke-reiju.i18n.ts";

export const op12VinsmokeReiju063: CharacterCard = {
  id: "OP12-063",
  canonicalId: "OP12-063",
  slug: "vinsmoke-reiju/op12-063",
  name: "Vinsmoke Reiju",
  printings: [
    {
      id: "OP12-063",
      artId: "OP12-063",
      setCode: "OP12",
      collectorNumber: "063",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-063_bkwE1a4.jpg",
    },
    {
      id: "OP12-063_p1",
      artId: "OP12-063_p1",
      setCode: "OP12",
      collectorNumber: "063",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-063_p1_qKrPCJQ.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP12",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["The Vinsmoke Family GERMA 66"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-063_p1_qKrPCJQ.jpg",
      imageId: "OP12-063_p1",
    },
  ],
  effect:
    "If you have 4 or more Events in your trash, this Character gains +2000 power and +5 cost.\n[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "trash",
            comparison: "gte",
            value: 4,
            filters: [
              {
                filter: "cardCategory",
                value: "event",
              },
            ],
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
            value: 2000,
            duration: "permanent",
          },
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 5,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op12VinsmokeReiju063I18n,
};
