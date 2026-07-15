import type { UnitCardDefinition } from "@tcg/gundam-types";

export const GundamBarbatos4thForm: UnitCardDefinition = {
  ap: 4,
  cardNumber: "ST05-001",
  cardType: "UNIT",
  cost: 4,
  hp: 5,
  id: "st05-001",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-001.webp?26013001",
  level: 6,
  linkRequirements: ["mikazuki-augus"],
  name: "Gundam Barbatos 4th Form",
  rarity: "legendary",
  setCode: "ST05",
  sourceTitle: "Mobile Suit Gundam IRON-BLOODED ORPHANS",
  text: "【Deploy】Choose 1 of your other Units. Deal 1 damage to it. It gets AP+1 during this turn.\nWhile this is damaged, it gains <Suppression>.\n\n(Damage to Shields by an attack is dealt to the first 2 cards simultaneously.)",
  traits: ["tekkadan", "gundam", "frame"],
  zones: ["space", "earth"],
};
