import type { CharacterCard } from "@tcg/op-types";
import { op16LittleOarsJr017I18n } from "./op16-017-littleoars-jr.i18n.ts";

export const op16LittleOarsJr017: CharacterCard = {
  id: "OP16-017",
  canonicalId: "OP16-017",
  slug: "littleoars-jr/op16-017",
  name: "LittleOars Jr.",
  printings: [
    {
      id: "OP16-017",
      artId: "OP16-017",
      setCode: "OP16",
      collectorNumber: "017",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-017_btMadr9.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP16",
  cost: 4,
  power: 8000,
  counter: 1000,
  traits: ["Giant Whitebeard Pirates Allies"],
  attribute: "strike",
  effect:
    'If you have no Characters with a type including "Whitebeard Pirates" and a cost of 8 or more give this Character -4000 power.\n\n[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)',
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
                value: "Whitebeard Pirates",
                match: "includes",
              },
              {
                filter: "cost",
                comparison: "gte",
                value: 8,
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
            value: -4000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op16LittleOarsJr017I18n,
};
