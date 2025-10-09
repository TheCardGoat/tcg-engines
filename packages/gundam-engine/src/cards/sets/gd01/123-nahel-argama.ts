import type { BaseCardDefinition_Structure } from "../../card-types";

export const NahelArgama: BaseCardDefinition_Structure = {
  id: "gd01-123",
  name: "Nahel Argama",
  cardNumber: "GD01-123",
  setCode: "GD01",
  cardType: "BASE",
  rarity: "uncommon",
  color: "blue",
  level: 3,
  cost: 2,
  text: "【Burst】Deploy this card.
【Deploy】Add 1 of your Shields to your hand. Then, choose 1 enemy Unit with 3 or less HP. Rest it.
",
  imageUrl: "../images/cards/card/GD01-123.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: NaN,
  hp: 5,
  zones: [
    "space",
    "earth",
  ],
  traits: [
    "earth",
    "federation",
    "warship",
  ],
  abilities: [
    {
      trigger: "ON_BURST",
      description: "【Burst】 Deploy this card.",
      effect: {
        type: "UNKNOWN",
        rawText: "Deploy this card.",
      },
    },
    {
      trigger: "ON_DEPLOY",
      description: "【Deploy】 Add 1 of your Shields to your hand. Then, choose 1 enemy Unit with 3 or less HP. Rest it.",
      effect: {
        type: "UNKNOWN",
        rawText: "Add 1 of your Shields to your hand. Then, choose 1 enemy Unit with 3 or less HP. Rest it.",
      },
    },
  ],
};
