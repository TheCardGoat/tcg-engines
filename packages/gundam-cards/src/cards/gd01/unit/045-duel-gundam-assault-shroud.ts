import type { UnitCardDefinition } from "@tcg/gundam-types";

export const DuelGundamAssaultShroud: UnitCardDefinition = {
  ap: 4,
  cardNumber: "GD01-045",
  cardType: "UNIT",
  color: "red",
  cost: 4,
  hp: 4,
  id: "gd01-045",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-045.webp?26013001",
  level: 5,
  linkRequirements: ["yzak-jule"],
  name: "Duel Gundam (Assault Shroud)",
  rarity: "legendary",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam SEED",
  text: "【When Paired】Look at the top 3 cards of your deck. You may deploy 1 (ZAFT) Unit card that is Lv.4 or lower among them. Return the remaining cards randomly to the bottom of your deck.",
  traits: ["zaft"],
  zones: ["space", "earth"],
};
