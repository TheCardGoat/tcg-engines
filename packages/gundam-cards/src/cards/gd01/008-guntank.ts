import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Guntank: UnitCardDefinition = {
  id: "gd01-008",
  name: "Guntank",
  cardNumber: "GD01-008",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "uncommon",
  color: "blue",
  level: 2,
  cost: 1,
  text: "【Deploy】Choose 1 rested enemy Unit. Deal 1 damage to it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-008.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: 1,
  hp: 2,
  zones: ["space", "earth"],
  traits: ["earth", "federation", "white", "base", "team"],
  linkRequirements: ["-"],
  effects: [
    {
      id: "gd01-008-effect-1",
      description:
        "【Deploy】 Choose 1 rested enemy Unit. Deal 1 damage to it.",
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
