import type { PilotCardDefinition } from "@tcg/gundam-types";

export const ZechsMerquise: PilotCardDefinition = {
  id: "st02-011",
  name: "Zechs Merquise",
  cardNumber: "ST02-011",
  setCode: "ST02",
  cardType: "PILOT",
  rarity: "common",
  color: "blue",
  level: 5,
  cost: 1,
  text: "【Burst】Add this card to your hand.\n【During Link】During your turn, when this Unit destroys an enemy Unit with battle damage, draw 1.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST02-011.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  traits: ["oz"],
  apModifier: 2,
  hpModifier: 1,
  abilities: [
    {
      trigger: "ON_BURST",
      description:
        "【Burst】 Add this card to your hand. 【During Link】During your turn, when this Unit destroys an enemy Unit with battle damage, draw 1.",
      effect: {
        type: "UNKNOWN",
        rawText:
          "Add this card to your hand. 【During Link】During your turn, when this Unit destroys an enemy Unit with battle damage, draw 1.",
      },
    },
  ],
};
