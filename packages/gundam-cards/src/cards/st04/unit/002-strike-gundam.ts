import type { UnitCardDefinition } from "@tcg/gundam-types";

export const StrikeGundam: UnitCardDefinition = {
  ap: 3,
  cardNumber: "ST04-002",
  cardType: "UNIT",
  color: "white",
  cost: 2,
  hp: 3,
  id: "st04-002",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-002.webp?26013001",
  level: 4,
  linkRequirements: ["kira-yamato"],
  name: "Strike Gundam",
  rarity: "common",
  setCode: "ST04",
  sourceTitle: "Mobile Suit Gundam SEED",
  text: "【Deploy】Draw 1. Then, discard 1.",
  traits: ["earth", "alliance"],
  zones: ["space", "earth"],
};
