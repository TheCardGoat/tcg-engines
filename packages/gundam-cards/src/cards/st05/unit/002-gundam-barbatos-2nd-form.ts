import type { UnitCardDefinition } from "@tcg/gundam-types";

export const GundamBarbatos2ndForm: UnitCardDefinition = {
  id: "st05-002",
  name: "Gundam Barbatos 2nd Form",
  cardNumber: "ST05-002",
  setCode: "ST05",
  cardType: "UNIT",
  rarity: "common",
  level: 4,
  cost: 2,
  text: "While this Unit is damaged, it gets AP+2.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST05-002.webp?26013001",
  sourceTitle: "Mobile Suit Gundam IRON-BLOODED ORPHANS",
  ap: 2,
  hp: 4,
  zones: ["space", "earth"],
  traits: ["tekkadan", "gundam", "frame"],
  linkRequirements: ["mikazuki-augus"],
};
