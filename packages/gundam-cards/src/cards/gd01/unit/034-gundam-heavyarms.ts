import type { UnitCardDefinition } from "@tcg/gundam-types";

export const GundamHeavyarms: UnitCardDefinition = {
  ap: 3,
  cardNumber: "GD01-034",
  cardType: "UNIT",
  color: "green",
  cost: 2,
  hp: 4,
  id: "gd01-034",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-034.webp?26013001",
  level: 4,
  linkRequirements: ["trowa-barton"],
  name: "Gundam Heavyarms",
  rarity: "uncommon",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam Wing",
  text: "【During Pair】This Unit gains <Breach 3>.\n\n(When this Unit&#039;s attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent&#039;s shield area.)",
  traits: ["operation", "meteor"],
  zones: ["earth"],
};
