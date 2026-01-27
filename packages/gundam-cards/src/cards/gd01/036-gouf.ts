import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Gouf: UnitCardDefinition = {
  id: "gd01-036",
  name: "Gouf",
  cardNumber: "GD01-036",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "green",
  level: 2,
  cost: 2,
  text: "-",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-036.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: 3,
  hp: 2,
  zones: ["earth"],
  traits: ["zeon"],
  linkRequirements: ["-"],
  effects: [
    {
      id: "gd01-036-effect-1",
      description: "-",
      type: "CONSTANT",
      action: {
        type: "CUSTOM",
        text: "-",
      },
    },
  ],
};
