import type { PilotCardDefinition } from "../../card-types";

export const McgillisFareed: PilotCardDefinition = {
  id: "st05-012",
  name: "McGillis Fareed",
  cardNumber: "ST05-012",
  setCode: "ST05",
  cardType: "PILOT",
  rarity: "common",
  color: "white",
  level: 4,
  cost: 1,
  text: "【Burst】Add this card to your hand.
【When Paired】If you have 2 or more other (Gjallarhorn)/(Tekkadan) Units in play, choose 1 enemy Unit with 3 or less HP. Rest it.
",
  imageUrl: "../images/cards/card/ST05-012.webp?2510031",
  sourceTitle: "Mobile Suit Gundam IRON-BLOODED ORPHANS",
  traits: [
    "gjallarhorn",
  ],
  apModifier: 2,
  hpModifier: 1,
  abilities: [
    {
      trigger: "ON_BURST",
      description: "【Burst】 Add this card to your hand.",
      effect: {
        type: "UNKNOWN",
        rawText: "Add this card to your hand.",
      },
    },
    {
      trigger: "WHEN_PAIRED",
      description: "【When Paired】 If you have 2 or more other (Gjallarhorn)/(Tekkadan) Units in play, choose 1 enemy Unit with 3 or less HP. Rest it.",
      effect: {
        type: "UNKNOWN",
        rawText: "If you have 2 or more other (Gjallarhorn)/(Tekkadan) Units in play, choose 1 enemy Unit with 3 or less HP. Rest it.",
      },
    },
  ],
};
