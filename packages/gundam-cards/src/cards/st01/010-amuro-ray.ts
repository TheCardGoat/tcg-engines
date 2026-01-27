import type { PilotCardDefinition } from "@tcg/gundam-types";

export const AmuroRay: PilotCardDefinition = {
  id: "st01-010",
  name: "Amuro Ray",
  cardNumber: "ST01-010",
  setCode: "ST01",
  cardType: "PILOT",
  rarity: "common",
  color: "blue",
  level: 4,
  cost: 1,
  text: "【Burst】Add this card to your hand.\n【When Paired】Choose 1 enemy Unit with 5 or less HP. Rest it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST01-010.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  traits: ["earth", "federation", "white", "base", "team", "newtype"],
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
      description:
        "【When Paired】 Choose 1 enemy Unit with 5 or less HP. Rest it.",
      effect: {
        type: "UNKNOWN",
        rawText: "Choose 1 enemy Unit with 5 or less HP. Rest it.",
      },
    },
  ],
};
