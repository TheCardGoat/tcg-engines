import type { UnitCardDefinition } from "@tcg/gundam-types";

export const AegisGundam: UnitCardDefinition = {
  ap: 4,
  cardNumber: "ST04-006",
  cardType: "UNIT",
  color: "red",
  cost: 3,
  hp: 3,
  id: "st04-006",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-006.webp?26013001",
  level: 4,
  linkRequirements: ["athrun-zala"],
  name: "Aegis Gundam",
  rarity: "legendary",
  setCode: "ST04",
  sourceTitle: "Mobile Suit Gundam SEED",
  text: "【Attack】If this Unit has 5 or more AP, choose 1 enemy Unit that is Lv.5 or higher. Deal 3 damage to it.",
  traits: ["zaft"],
  zones: ["space", "earth"],
};
