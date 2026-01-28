import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Beguirpente: UnitCardDefinition = {
  id: "gd01-084",
  name: "Beguir-Pente",
  cardNumber: "GD01-084",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "white",
  level: 2,
  cost: 2,
  text: "-",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-084.webp?2510031",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  ap: 2,
  hp: 3,
  zones: ["space", "earth"],
  traits: ["academy"],
  linkRequirements: ["-"],
  effects: [
    {
      id: "eff-xtn6z9o80",
      type: "CONSTANT",
      description: "-",
      restrictions: [],
      conditions: [],
      action: {
        type: "CUSTOM",
        text: "-",
      },
    },
  ],
};
