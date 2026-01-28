import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Gundam: UnitCardDefinition = {
  id: "gd01-013",
  name: "Gundam",
  cardNumber: "GD01-013",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "blue",
  level: 4,
  cost: 2,
  text: "-",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-013.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: 3,
  hp: 4,
  zones: ["space", "earth"],
  traits: ["earth", "federation", "white", "base", "team"],
  linkRequirements: ["amuro-ray"],
  effects: [
    {
      id: "eff-uvw5smd4d",
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
