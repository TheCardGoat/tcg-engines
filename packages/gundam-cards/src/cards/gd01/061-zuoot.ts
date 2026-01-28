import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Zuoot: UnitCardDefinition = {
  id: "gd01-061",
  name: "ZuOOT",
  cardNumber: "GD01-061",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "red",
  level: 1,
  cost: 1,
  text: "【Activate･Main】<Support 1> (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-061.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: Number.NaN,
  hp: 2,
  zones: ["earth"],
  traits: ["zaft"],
  linkRequirements: ["-"],
  keywords: [
    {
      keyword: "Support",
      value: 1,
    },
  ],
  effects: [
    {
      id: "eff-08dudewre",
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
