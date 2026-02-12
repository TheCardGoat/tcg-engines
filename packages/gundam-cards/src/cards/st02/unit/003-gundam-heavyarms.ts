import type { UnitCardDefinition } from "@tcg/gundam-types";

export const GundamHeavyarms: UnitCardDefinition = {
  ap: 3,
  cardNumber: "ST02-003",
  cardType: "UNIT",
  color: "green",
  cost: 3,
  hp: 4,
  id: "st02-003",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-003.webp?26013001",
  level: 5,
  linkRequirements: ["trowa-barton"],
  name: "Gundam Heavyarms",
  rarity: "common",
  setCode: "ST02",
  sourceTitle: "Mobile Suit Gundam Wing",
  text: "【During Pair】During your turn, when this Unit destroys an enemy Unit with battle damage, deal 1 damage to all enemy Units that are Lv.3 or lower.",
  traits: ["operation", "meteor"],
  zones: ["earth"],
};
