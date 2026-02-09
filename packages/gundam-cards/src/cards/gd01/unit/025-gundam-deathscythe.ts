import type { UnitCardDefinition } from "@tcg/gundam-types";

export const GundamDeathscythe: UnitCardDefinition = {
  id: "gd01-025",
  name: "Gundam Deathscythe",
  cardNumber: "GD01-025",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "legendary",
  color: "green",
  level: 6,
  cost: 4,
  text: "【When Paired･(Operation Meteor) Pilot】Place 1 rested Resource. Then, this Unit gains <First Strike> during this turn.\n\n(While this Unit is attacking, it deals damage before the enemy Unit.)",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-025.webp?26013001",
  sourceTitle: "Mobile Suit Gundam Wing",
  ap: 5,
  hp: 4,
  zones: ["earth"],
  traits: ["operation", "meteor"],
  linkRequirements: ["duo-maxwell"],
};
