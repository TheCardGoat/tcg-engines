import type { UnitCardDefinition } from "@tcg/gundam-types";

export const GundamDeathscythe: UnitCardDefinition = {
  ap: 5,
  cardNumber: "GD01-025",
  cardType: "UNIT",
  color: "green",
  cost: 4,
  hp: 4,
  id: "gd01-025",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-025.webp?26013001",
  level: 6,
  linkRequirements: ["duo-maxwell"],
  name: "Gundam Deathscythe",
  rarity: "legendary",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam Wing",
  text: "【When Paired･(Operation Meteor) Pilot】Place 1 rested Resource. Then, this Unit gains <First Strike> during this turn.\n\n(While this Unit is attacking, it deals damage before the enemy Unit.)",
  traits: ["operation", "meteor"],
  zones: ["earth"],
};
