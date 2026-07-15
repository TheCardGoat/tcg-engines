import type { UnitCardDefinition } from "@tcg/gundam-types";

export const GundamAerial: UnitCardDefinition = {
  ap: 3,
  cardNumber: "GD01-070",
  cardType: "UNIT",
  color: "white",
  cost: 3,
  hp: 3,
  id: "gd01-070",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-070.webp?26013001",
  level: 5,
  linkRequirements: ["suletta-mercury"],
  name: "Gundam Aerial",
  rarity: "rare",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  text: "While there are 4 or more Command cards in your trash, this card in your hand gets cost -2.",
  traits: ["academy"],
  zones: ["space", "earth"],
};
