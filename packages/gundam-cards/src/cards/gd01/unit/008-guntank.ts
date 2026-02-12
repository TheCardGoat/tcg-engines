import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Guntank: UnitCardDefinition = {
  ap: 1,
  cardNumber: "GD01-008",
  cardType: "UNIT",
  color: "blue",
  cost: 1,
  hp: 2,
  id: "gd01-008",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-008.webp?26013001",
  level: 2,
  linkRequirements: ["-"],
  name: "Guntank",
  rarity: "uncommon",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam",
  text: "【Deploy】Choose 1 rested enemy Unit. Deal 1 damage to it.",
  traits: ["earth", "federation", "white", "base", "team"],
  zones: ["space", "earth"],
};
