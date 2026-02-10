import type { BaseCardDefinition } from "@tcg/gundam-types";

export const Falmel: BaseCardDefinition = {
  id: "st03-016",
  name: "Falmel",
  cardNumber: "ST03-016",
  setCode: "ST03",
  cardType: "BASE",
  rarity: "common",
  color: "green",
  level: 3,
  cost: 2,
  text: "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand. Then, if it is your turn, deploy 1 rested [Char's Zaku Ⅱ]((Zeon)･AP3･HP1) Unit token.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST03-016.webp?26013001",
  sourceTitle: "Mobile Suit Gundam",
  ap: 0,
  hp: 5,
  zones: ["space"],
  traits: ["zeon", "warship"],
};
