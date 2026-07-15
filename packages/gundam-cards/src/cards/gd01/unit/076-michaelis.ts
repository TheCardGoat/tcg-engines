import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Michaelis: UnitCardDefinition = {
  ap: 3,
  cardNumber: "GD01-076",
  cardType: "UNIT",
  color: "white",
  cost: 2,
  hp: 3,
  id: "gd01-076",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-076.webp?26013001",
  level: 3,
  linkRequirements: ["(academy)-trait"],
  name: "Michaelis",
  rarity: "uncommon",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  text: "While there are 4 or more Command cards in your trash, this Unit gets AP+1 and HP+1.",
  traits: ["academy"],
  zones: ["space", "earth"],
};
