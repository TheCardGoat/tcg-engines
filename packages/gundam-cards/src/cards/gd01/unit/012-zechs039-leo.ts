import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Zechs039Leo: UnitCardDefinition = {
  id: "gd01-012",
  name: "Zechs&#039; Leo",
  cardNumber: "GD01-012",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "uncommon",
  color: "blue",
  level: 3,
  cost: 2,
  text: "【When Paired】Choose 1 enemy Unit with 3 or less HP. Rest it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-012.webp?26013001",
  sourceTitle: "Mobile Suit Gundam Wing",
  ap: 3,
  hp: 2,
  zones: ["space", "earth"],
  traits: ["oz"],
  linkRequirements: ["(oz)-trait"],
};
