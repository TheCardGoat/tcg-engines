import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Gogg: UnitCardDefinition = {
  id: "gd01-037",
  name: "Gogg",
  cardNumber: "GD01-037",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "green",
  level: 2,
  cost: 2,
  text: "-",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-037.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: 2,
  hp: 3,
  zones: ["earth"],
  traits: ["zeon"],
  linkRequirements: ["-"],
  effects: [
    {
      id: "eff-fstgj0dik",
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
