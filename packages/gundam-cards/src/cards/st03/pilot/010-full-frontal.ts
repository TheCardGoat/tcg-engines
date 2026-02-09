import type { PilotCardDefinition } from "@tcg/gundam-types";

export const FullFrontal: PilotCardDefinition = {
  id: "st03-010",
  name: "Full Frontal",
  cardNumber: "ST03-010",
  setCode: "ST03",
  cardType: "PILOT",
  rarity: "common",
  color: "red",
  level: 6,
  cost: 1,
  text: "【Burst】Add this card to your hand.\n【When Paired】You may deploy 1 (Neo Zeon)/(Zeon) Unit card that is Lv.4 or lower from your hand.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST03-010.webp?26013001",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  traits: ["neo", "zeon", "cyber-newtype"],
  apModifier: 2,
  hpModifier: 2,
};
