import type { UnitCardDefinition } from "../../card-types";

export const Chuchu039sDemiTrainer: UnitCardDefinition = {
  id: "gd01-074",
  name: "Chuchu&#039;s Demi Trainer",
  cardNumber: "GD01-074",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "rare",
  color: "white",
  level: 2,
  cost: 2,
  text: "【Attack】Draw 1. Then, discard 1.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-074.webp?2510031",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  ap: 3,
  hp: 1,
  zones: ["space", "earth"],
  traits: ["academy"],
  linkRequirements: ["chuatury-panlunch"],
  abilities: [
    {
      trigger: "ON_ATTACK",
      description: "【Attack】 Draw 1. Then, discard 1.",
      effect: {
        type: "UNKNOWN",
        rawText: "Draw 1. Then, discard 1.",
      },
    },
  ],
};
