import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Shamblo: UnitCardDefinition = {
  ap: 6,
  cardNumber: "GD01-047",
  cardType: "UNIT",
  color: "red",
  cost: 7,
  hp: 5,
  id: "gd01-047",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-047.webp?26013001",
  level: 8,
  linkRequirements: ["(newtype)-trait-/-(cyber-newtype)-trait"],
  name: "Shamblo",
  rarity: "rare",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  text: "【Attack】If 2 or more other rested friendly Units are in play, choose 1 enemy Unit. Deal 3 damage to it.",
  traits: ["zeon"],
  zones: ["earth"],
};
