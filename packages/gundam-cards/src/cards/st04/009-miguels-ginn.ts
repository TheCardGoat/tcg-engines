import type { UnitCardDefinition } from "@tcg/gundam-types";

export const MiguelsGinn: UnitCardDefinition = {
  id: "st04-009",
  name: "Miguel's Ginn",
  cardNumber: "ST04-009",
  setCode: "ST04",
  cardType: "UNIT",
  rarity: "common",
  color: "red",
  level: 2,
  cost: 2,
  text: "【During Pair】【Destroyed】If you have another Link Unit in play, draw 1.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST04-009.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: 3,
  hp: 1,
  zones: ["space", "earth"],
  traits: ["zaft"],
  linkRequirements: ["miguel-ayman"],
  abilities: [
    {
      trigger: "ON_DESTROYED",
      description:
        "【Destroyed】 If you have another Link Unit in play, draw 1.",
      effect: {
        type: "UNKNOWN",
        rawText: "If you have another Link Unit in play, draw 1.",
      },
    },
  ],
};
