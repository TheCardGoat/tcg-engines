import type { UnitCardDefinition } from "../../card-types";

export const StrikeGundam: UnitCardDefinition = {
  id: "st04-002",
  name: "Strike Gundam",
  cardNumber: "ST04-002",
  setCode: "ST04",
  cardType: "UNIT",
  rarity: "common",
  color: "white",
  level: 4,
  cost: 2,
  text: "【Deploy】Draw 1. Then, discard 1.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST04-002.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: 3,
  hp: 3,
  zones: ["space", "earth"],
  traits: ["earth", "alliance"],
  linkRequirements: ["kira-yamato"],
  abilities: [
    {
      trigger: "ON_DEPLOY",
      description: "【Deploy】 Draw 1. Then, discard 1.",
      effect: {
        type: "UNKNOWN",
        rawText: "Draw 1. Then, discard 1.",
      },
    },
  ],
};
