import type { UnitCardDefinition } from "@tcg/gundam-types";

export const CharsZaku: UnitCardDefinition = {
  ap: 3,
  cardNumber: "ST03-006",
  cardType: "UNIT",
  color: "green",
  cost: 2,
  hp: 2,
  id: "st03-006",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-006.webp?26013001",
  level: 3,
  linkRequirements: ["char-aznable"],
  name: "Char's Zaku Ⅱ",
  rarity: "legendary",
  setCode: "ST03",
  sourceTitle: "Mobile Suit Gundam",
  text: "【Destroyed】Look at the top 3 cards of your deck. You may reveal 1 (Zeon)/(Neo Zeon) Unit card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
  traits: ["zeon"],
  zones: ["space", "earth"],
};
