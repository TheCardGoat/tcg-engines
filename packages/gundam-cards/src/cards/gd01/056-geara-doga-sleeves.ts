import type { UnitCardDefinition } from "@tcg/gundam-types";

export const GearaDogaSleeves: UnitCardDefinition = {
  id: "gd01-056",
  name: "Geara Doga (Sleeves)",
  cardNumber: "GD01-056",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "red",
  level: 3,
  cost: 2,
  text: "【Destroyed】Choose 1 enemy Unit with 5 or less AP. Deal 1 damage to it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-056.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: 2,
  hp: 3,
  zones: ["space", "earth"],
  traits: ["neo", "zeon"],
  linkRequirements: ["-"],
  effects: [
    {
      id: "eff-m2sza3q95",
      type: "TRIGGERED",
      timing: "DESTROYED",
      description:
        "Choose 1 enemy Unit with 5 or less AP. Deal 1 damage to it.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "DAMAGE",
        value: 1,
        target: {
          controller: "OPPONENT",
          cardType: "UNIT",
          count: {
            min: 1,
            max: 1,
          },
          filters: [
            {
              type: "ap",
              comparison: "lte",
              value: 5,
            },
          ],
        },
      },
    },
  ],
};
