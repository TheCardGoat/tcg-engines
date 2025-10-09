import type { UnitCardDefinition } from "../../card-types";

export const Ball: UnitCardDefinition = {
  id: "gd01-015",
  name: "Ball",
  cardNumber: "GD01-015",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "blue",
  level: 1,
  cost: 1,
  text: "【Attack】Choose 1 of your Units. It recovers 1 HP.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-015.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: 1,
  hp: 1,
  zones: ["space"],
  traits: ["earth", "federation"],
  linkRequirements: ["-"],
  abilities: [
    {
      trigger: "ON_ATTACK",
      description: "【Attack】 Choose 1 of your Units. It recovers 1 HP.",
      effect: {
        type: "RECOVER_HP",
        amount: 1,
        target: {
          type: "self",
        },
      },
    },
  ],
};
