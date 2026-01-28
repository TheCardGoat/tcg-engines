import type { UnitCardDefinition } from "@tcg/gundam-types";

export const GearaDogaHeavyArmedType: UnitCardDefinition = {
  id: "gd01-053",
  name: "Geara Doga (Heavy Armed Type)",
  cardNumber: "GD01-053",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "uncommon",
  color: "red",
  level: 4,
  cost: 3,
  text: "【Activate･Main】【Once per Turn】①：Choose 1 enemy Unit with 2 or less AP. Deal 1 damage to it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-053.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: 4,
  hp: 2,
  zones: ["space", "earth"],
  traits: ["neo", "zeon"],
  linkRequirements: ["-"],
  effects: [
    {
      id: "eff-h23nul2mc",
      type: "ACTIVATED",
      timing: "MAIN",
      description:
        "【Once per Turn】①:Choose 1 enemy Unit with 2 or less AP. Deal 1 damage to it.",
      restrictions: [
        {
          type: "ONCE_PER_TURN",
        },
      ],
      costs: [
        {
          type: "ENERGY",
          amount: 1,
        },
      ],
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
              value: 2,
            },
          ],
        },
      },
    },
  ],
};
