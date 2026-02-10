import type { PilotCardDefinition } from "@tcg/gundam-types";

export const AthrunZala: PilotCardDefinition = {
  id: "st04-011",
  name: "Athrun Zala",
  cardNumber: "ST04-011",
  setCode: "ST04",
  cardType: "PILOT",
  rarity: "common",
  color: "red",
  level: 4,
  cost: 1,
  text: "【Burst】Add this card to your hand.\n【When Linked】During this turn, this Unit may choose an active enemy Unit that is Lv.5 or lower as its attack target.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST04-011.webp?26013001",
  sourceTitle: "Mobile Suit Gundam SEED",
  traits: ["zaft", "coordinator"],
  apModifier: 1,
  hpModifier: 2,
};
