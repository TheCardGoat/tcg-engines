import type { BaseCardDefinition } from "@tcg/gundam-types";

export const CorsicaBase: BaseCardDefinition = {
  ap: 0,
  cardNumber: "ST02-016",
  cardType: "BASE",
  color: "blue",
  cost: 3,
  hp: 5,
  id: "st02-016",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-016.webp?26013001",
  level: 3,
  name: "Corsica Base",
  rarity: "common",
  setCode: "ST02",
  sourceTitle: "Mobile Suit Gundam Wing",
  text: '【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand. Then, if it is your turn, deploy 1 [Tallgeese]((OZ)･AP4･HP2) Unit token. If it is your turn and a card with "Corsica Base" in its card name is in your trash, deploy 2 [Leo]((OZ)･AP1･HP1) Unit tokens instead.',
  traits: ["oz", "stronghold"],
  zones: ["earth"],
};
