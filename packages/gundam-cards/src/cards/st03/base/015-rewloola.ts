import type { BaseCardDefinition } from "@tcg/gundam-types";

export const Rewloola: BaseCardDefinition = {
  id: "st03-015",
  name: "Rewloola",
  cardNumber: "ST03-015",
  setCode: "ST03",
  cardType: "BASE",
  rarity: "common",
  color: "red",
  level: 3,
  cost: 2,
  text: "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand. Then, choose 1 enemy Unit with 5 or less AP. Deal 1 damage to it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST03-015.webp?26013001",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: 0,
  hp: 5,
  zones: ["space"],
  traits: ["neo", "zeon", "warship"],
};
