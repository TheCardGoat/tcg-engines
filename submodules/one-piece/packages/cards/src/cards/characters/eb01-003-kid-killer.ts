import type { CharacterCard } from "@tcg/op-types";
import { eb01KidKiller003I18n } from "./eb01-003-kid-killer.i18n.ts";

export const eb01KidKiller003: CharacterCard = {
  id: "EB01-003",
  canonicalId: "EB01-003",
  slug: "kid-killer/eb01-003",
  name: "Kid & Killer",
  printings: [
    {
      id: "EB01-003",
      artId: "EB01-003",
      setCode: "EB01",
      collectorNumber: "003",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-003.jpg",
    },
    {
      id: "EB01-003_p1",
      artId: "EB01-003_p1",
      setCode: "EB01",
      collectorNumber: "003",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-003_p1.jpg",
      label: "Kid & Killer (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "EB01",
  cost: 4,
  power: 5000,
  traits: ["Kid Pirates Supernovas"],
  attribute: ["slash", "special"],
  effect:
    "[Rush] (This card can attack on the turn in which it is played.)[When Attacking] If your opponent has 2 or less Life cards, this Character gains +2000 power during this turn.",
  effects: {
    keywords: ["rush"],
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "lifeCount",
            player: "opponent",
            comparison: "lte",
            value: 2,
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
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: eb01KidKiller003I18n,
};
