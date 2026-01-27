import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Dinn: UnitCardDefinition = {
  id: "gd01-064",
  name: "DINN",
  cardNumber: "GD01-064",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "red",
  level: 2,
  cost: 2,
  text: "-",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-064.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: 3,
  hp: 2,
  zones: ["earth"],
  traits: ["zaft"],
  linkRequirements: ["-"],
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
