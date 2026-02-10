import type { UnitCardDefinition } from "@tcg/gundam-types";

export const GundamAerialPermetScoreSix: UnitCardDefinition = {
  id: "st01-006",
  name: "Gundam Aerial (Permet Score Six)",
  cardNumber: "ST01-006",
  setCode: "ST01",
  cardType: "UNIT",
  rarity: "legendary",
  color: "white",
  level: 5,
  cost: 4,
  text: "【When Paired】Choose 1 enemy Unit that is Lv.5 or lower. It gets AP-3 during this turn.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST01-006.webp?26013001",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  ap: 4,
  hp: 4,
  zones: ["space", "earth"],
  traits: ["academy"],
  linkRequirements: ["suletta-mercury"],
};
