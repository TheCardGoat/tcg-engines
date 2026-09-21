import type { CharacterCard } from "@tcg/op-types";
import { eb04SmokerTashigi003I18n } from "./eb04-003-smoker-tashigi.i18n.ts";

export const eb04SmokerTashigi003: CharacterCard = {
  id: "EB04-003",
  canonicalId: "EB04-003",
  slug: "smoker-tashigi/eb04-003",
  name: "Smoker & Tashigi",
  printings: [
    {
      id: "EB04-003",
      artId: "EB04-003",
      setCode: "EB04",
      collectorNumber: "003",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-003_wJsToTH.jpg",
    },
    {
      id: "EB04-003_p1",
      artId: "EB04-003_p1",
      setCode: "EB04",
      collectorNumber: "003",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-003_p1_s3bTHgp.jpg",
      label: "Smoker & Tashigi (SP)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "EB04",
  cost: 8,
  power: 8000,
  traits: ["Navy Punk Hazard"],
  attribute: ["slash", "special"],
  effect:
    "[Rush] (This card can attack on the turn in which it is played.)\n[Opponent's Turn] Your {Navy} type Leader's base power becomes 7000.",
  effects: {
    keywords: ["rush"],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        actions: [
          {
            action: "setBasePower",
            target: {
              player: "self",
              zones: ["leader"],
              count: { amount: 1 },
            },
            value: 7000,
          },
        ],
      },
    ],
  },

  i18n: eb04SmokerTashigi003I18n,
};
