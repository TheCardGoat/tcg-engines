import type { UnitCardDefinition } from "@tcg/gundam-types";

export const DreissenSleeves: UnitCardDefinition = {
  id: "gd01-057",
  name: "Dreissen (Sleeves)",
  cardNumber: "GD01-057",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "red",
  level: 2,
  cost: 2,
  text: "-",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-057.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: 2,
  hp: 3,
  zones: ["space", "earth"],
  traits: ["neo", "zeon"],
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
