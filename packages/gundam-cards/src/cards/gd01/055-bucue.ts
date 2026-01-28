import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Bucue: UnitCardDefinition = {
  id: "gd01-055",
  name: "BuCUE",
  cardNumber: "GD01-055",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "uncommon",
  color: "red",
  level: 3,
  cost: 2,
  text: "【Activate･Main】<Support 2> (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-055.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: 2,
  hp: 3,
  zones: ["earth"],
  traits: ["zaft"],
  linkRequirements: ["-"],
  keywords: [
    {
      keyword: "Support",
      value: 2,
    },
  ],
  effects: [
    {
      id: "eff-s22tk0rnn",
      type: "ACTIVATED",
      timing: "MAIN",
      description: "during this turn.)",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "CUSTOM",
        text: "during this turn.)",
      },
    },
  ],
};
