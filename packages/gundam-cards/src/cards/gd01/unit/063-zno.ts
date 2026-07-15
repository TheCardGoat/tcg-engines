import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Zno: UnitCardDefinition = {
  ap: 2,
  cardNumber: "GD01-063",
  cardType: "UNIT",
  color: "red",
  cost: 2,
  hp: 1,
  id: "gd01-063",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-063.webp?26013001",
  level: 2,
  linkRequirements: ["(zaft)-trait"],
  name: "ZnO",
  rarity: "uncommon",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam SEED",
  text: "During your turn, while this Unit is battling an enemy Unit that is Lv.2 or lower, it gains <First Strike>.\n\n(While this Unit is attacking, it deals damage before the enemy Unit.)",
  traits: ["zaft"],
  zones: ["earth"],
};
