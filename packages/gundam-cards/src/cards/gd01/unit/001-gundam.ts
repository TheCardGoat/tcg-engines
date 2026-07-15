import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Gundam: UnitCardDefinition = {
  ap: 3,
  cardNumber: "GD01-001",
  cardType: "UNIT",
  color: "blue",
  cost: 3,
  hp: 3,
  id: "gd01-001",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-001.webp?26013001",
  level: 4,
  linkRequirements: ["amuro-ray"],
  name: "Gundam",
  rarity: "legendary",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam",
  text: "All your (White Base Team) Units gain <Repair 1>.\n\n(At the end of your turn, this Unit recovers the specified number of HP.)\n【When Paired】If you have 2 or more other Units in play, draw 1.",
  traits: ["earth", "federation", "white", "base", "team"],
  zones: ["space", "earth"],
};
