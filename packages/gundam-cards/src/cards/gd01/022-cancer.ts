import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Cancer: UnitCardDefinition = {
  id: "gd01-022",
  name: "Cancer",
  cardNumber: "GD01-022",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "blue",
  level: 2,
  cost: 2,
  text: "-",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-022.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  ap: 2,
  hp: 3,
  zones: ["earth"],
  traits: ["oz"],
  linkRequirements: ["-"],
  effects: [
    {
      id: "eff-dejyw3nl1",
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
