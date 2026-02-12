import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Lagowe: UnitCardDefinition = {
  ap: 2,
  cardNumber: "GD01-050",
  cardType: "UNIT",
  color: "red",
  cost: 2,
  hp: 3,
  id: "gd01-050",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-050.webp?26013001",
  level: 3,
  linkRequirements: ["(zaft)-trait"],
  name: "LaGOWE",
  rarity: "rare",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam SEED",
  text: "【Attack】If this Unit has 5 or more AP and it is attacking an enemy Unit, choose 1 enemy Unit. Deal 2 damage to it.",
  traits: ["zaft"],
  zones: ["earth"],
};
