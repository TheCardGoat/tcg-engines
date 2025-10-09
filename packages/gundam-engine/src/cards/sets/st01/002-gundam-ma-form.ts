import type { UnitCardDefinition } from "../../card-types";

export const GundamMaForm: UnitCardDefinition = {
  id: "st01-002",
  name: "Gundam (MA Form)",
  cardNumber: "ST01-002",
  setCode: "ST01",
  cardType: "UNIT",
  rarity: "common",
  color: "blue",
  level: 5,
  cost: 3,
  text: "【When Paired･(White Base Team) Pilot】Draw 1.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST01-002.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: 4,
  hp: 3,
  zones: ["space"],
  traits: ["earth", "federation", "white", "base", "team"],
  linkRequirements: ["amuro-ray"],
  abilities: [
    {
      description: "【When Paired･(White Base Team) Pilot】Draw 1.",
      effect: {
        type: "UNKNOWN",
        rawText: "【When Paired･(White Base Team) Pilot】Draw 1.",
      },
    },
  ],
};
