import type { UnitCardDefinition } from "@tcg/gundam-types";

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
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-015.webp?26013001",
  sourceTitle: "Mobile Suit Gundam",
  ap: 1,
  hp: 1,
  zones: ["space"],
  traits: ["earth", "federation"],
  linkRequirements: ["-"],
};
