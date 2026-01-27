import type { UnitCardDefinition } from "@tcg/gundam-types";

export const GearaZuluGuardsType: UnitCardDefinition = {
  id: "gd01-052",
  name: "Geara Zulu (Guards Type)",
  cardNumber: "GD01-052",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "uncommon",
  color: "red",
  level: 4,
  cost: 3,
  text: "【Deploy】Choose 1 enemy Unit. Deal 1 damage to it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-052.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: 2,
  hp: 4,
  zones: ["space", "earth"],
  traits: ["neo", "zeon"],
  linkRequirements: ["-"],
  effects: [
    {
      id: "gd01-052-effect-1",
      description: "【Deploy】 Choose 1 enemy Unit. Deal 1 damage to it.",
      type: "TRIGGERED",
      timing: "DEPLOY",
      action: {
        type: "DAMAGE",
        parameters: {
          target: {
            type: "unknown",
            rawText: "it",
          },
          amount: 1,
        },
      },
    },
  ],
};
