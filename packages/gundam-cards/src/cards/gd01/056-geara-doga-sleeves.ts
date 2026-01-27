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
  abilities: [
    {
      trigger: "ON_DESTROYED",
      description:
        "【Destroyed】 Choose 1 enemy Unit with 5 or less AP. Deal 1 damage to it.",
      effect: {
        type: "DAMAGE",
        amount: 1,
        target: {
          type: "unknown",
          rawText: "it",
        },
      },
    },
  ],
};
