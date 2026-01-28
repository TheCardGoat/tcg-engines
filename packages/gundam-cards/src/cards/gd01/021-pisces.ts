import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Pisces: UnitCardDefinition = {
  id: "gd01-021",
  name: "Pisces",
  cardNumber: "GD01-021",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "blue",
  level: 1,
  cost: 1,
  text: "-",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-021.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  ap: 1,
  hp: 2,
  zones: ["earth"],
  traits: ["oz"],
  linkRequirements: ["-"],
  effects: [
    {
      id: "eff-ubmbs108o",
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
