import type { BaseCardDefinition } from "@tcg/gundam-types";

export const NahelArgama: BaseCardDefinition = {
  id: "gd01-123",
  name: "Nahel Argama",
  cardNumber: "GD01-123",
  setCode: "GD01",
  cardType: "BASE",
  rarity: "uncommon",
  color: "blue",
  level: 3,
  cost: 2,
  text: "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand. Then, choose 1 enemy Unit with 3 or less HP. Rest it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-123.webp?26013001",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: 0,
  hp: 5,
  zones: ["space", "earth"],
  traits: ["earth", "federation", "warship"],
};
