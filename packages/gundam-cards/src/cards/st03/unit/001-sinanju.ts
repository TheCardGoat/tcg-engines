import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Sinanju: UnitCardDefinition = {
  ap: 5,
  cardNumber: "ST03-001",
  cardType: "UNIT",
  color: "red",
  cost: 5,
  hp: 4,
  id: "st03-001",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-001.webp?26013001",
  level: 6,
  linkRequirements: ["full-frontal"],
  name: "Sinanju",
  rarity: "legendary",
  setCode: "ST03",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  text: "【During Pair】This Unit gains <High-Maneuver>.\n\r\n(This Unit can't be blocked.)\nDuring your turn, when this Unit destroys an enemy shield area card with battle damage, choose 1 enemy Unit. Deal 2 damage to it.",
  traits: ["neo", "zeon"],
  zones: ["space", "earth"],
};
