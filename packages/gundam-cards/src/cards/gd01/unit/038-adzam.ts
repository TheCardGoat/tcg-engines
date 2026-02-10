import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Adzam: UnitCardDefinition = {
  id: "gd01-038",
  name: "Adzam",
  cardNumber: "GD01-038",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "uncommon",
  color: "green",
  level: 5,
  cost: 4,
  text: "【Deploy】If 5 or more enemy Units are in play, deal 1 damage to all enemy Units.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-038.webp?26013001",
  sourceTitle: "Mobile Suit Gundam",
  ap: 2,
  hp: 5,
  zones: ["earth"],
  traits: ["zeon"],
  linkRequirements: ["(zeon)-trait"],
};
