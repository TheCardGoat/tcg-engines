import type { PilotCardDefinition } from "@tcg/gundam-types";

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
  text: "【Burst】Add this card to your hand.\n【When Paired】If you have 2 or more other (Gjallarhorn)/(Tekkadan) Units in play, choose 1 enemy Unit with 3 or less HP. Rest it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST05-012.webp?2510031",
  sourceTitle: "Mobile Suit Gundam IRON-BLOODED ORPHANS",
  traits: ["gjallarhorn"],
  apModifier: 2,
  hpModifier: 1,
  effects: [
    {
      id: "eff-9stedzcbi",
      type: "TRIGGERED",
      timing: "BURST",
      description: "Add this card to your hand.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "ADD_TO_HAND",
      },
    },
    {
      id: "eff-ba4nkxvmj",
      type: "TRIGGERED",
      timing: "WHEN_PAIRED",
      description:
        "If you have 2 or more other (Gjallarhorn)/(Tekkadan) Units in play, choose 1 enemy Unit with 3 or less HP. Rest it.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "CONDITIONAL",
        conditions: [
          {
            type: "STATE_CHECK",
            text: "you have 2 or more other (Gjallarhorn)/(Tekkadan) Units in play",
          },
        ],
        trueAction: {
          type: "CUSTOM",
          text: "choose 1 enemy Unit with 3 or less HP. Rest it.",
        },
      },
    },
  ],
};
