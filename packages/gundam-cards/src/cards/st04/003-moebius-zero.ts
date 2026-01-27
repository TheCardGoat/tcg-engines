import type { UnitCardDefinition } from "@tcg/gundam-types";

export const MoebiusZero: UnitCardDefinition = {
  id: "st04-003",
  name: "Moebius Zero",
  cardNumber: "ST04-003",
  setCode: "ST04",
  cardType: "UNIT",
  rarity: "common",
  color: "white",
  level: 3,
  cost: 2,
  text: "-",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST04-003.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: 2,
  hp: 4,
  zones: ["space"],
  traits: ["earth", "alliance"],
  linkRequirements: ["mu-la-flaga"],
  abilities: [
    {
      description: "-",
      effect: {
        type: "UNKNOWN",
        rawText: "-",
      },
    },
  ],
};
