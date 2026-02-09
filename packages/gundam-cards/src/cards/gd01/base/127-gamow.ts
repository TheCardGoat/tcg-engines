import type { BaseCardDefinition_Structure } from "@tcg/gundam-types";

export const Gamow: BaseCardDefinition_Structure = {
  id: "gd01-127",
  name: "Gamow",
  cardNumber: "GD01-127",
  setCode: "GD01",
  cardType: "BASE",
  rarity: "uncommon",
  color: "red",
  level: 2,
  cost: 1,
  text: "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\n【Activate･Action】Rest this Base：Choose 1 friendly (ZAFT) Unit with 5 or more AP. It gains <Breach 3> during this battle.\n\n(When this Unit&#039;s attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent&#039;s shield area.)",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-127.webp?26013001",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: Number.NaN,
  hp: 5,
  zones: ["space"],
  traits: ["zaft", "warship"],
};
