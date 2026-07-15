import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Jegan: UnitCardDefinition = {
  ap: 2,
  cardNumber: "GD01-016",
  cardType: "UNIT",
  color: "blue",
  cost: 2,
  hp: 3,
  id: "gd01-016",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-016.webp?26013001",
  level: 3,
  linkRequirements: ["-"],
  name: "Jegan",
  rarity: "common",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  text: "While you have 2 or more (Earth Federation) Units in play, this card in your hand gets cost -1.",
  traits: ["earth", "federation"],
  zones: ["space", "earth"],
};
