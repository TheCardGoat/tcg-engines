import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Lagowe: UnitCardDefinition = {
  id: "gd01-050",
  name: "LaGOWE",
  cardNumber: "GD01-050",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "rare",
  color: "red",
  level: 3,
  cost: 2,
  text: "【Attack】If this Unit has 5 or more AP and it is attacking an enemy Unit, choose 1 enemy Unit. Deal 2 damage to it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-050.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: 2,
  hp: 3,
  zones: ["earth"],
  traits: ["zaft"],
  linkRequirements: ["(zaft)-trait"],
  abilities: [
    {
      trigger: "ON_ATTACK",
      description:
        "【Attack】 If this Unit has 5 or more AP and it is attacking an enemy Unit, choose 1 enemy Unit. Deal 2 damage to it.",
      effect: {
        type: "DAMAGE",
        amount: 2,
        target: {
          type: "unknown",
          rawText: "it",
        },
      },
    },
  ],
};
