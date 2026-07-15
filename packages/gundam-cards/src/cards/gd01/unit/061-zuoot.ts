import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Zuoot: UnitCardDefinition = {
  ap: Number.NaN,
  cardNumber: "GD01-061",
  cardType: "UNIT",
  color: "red",
  cost: 1,
  hp: 2,
  id: "gd01-061",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-061.webp?26013001",
  keywords: [
    {
      keyword: "Support",
      value: 1,
    },
  ],
  level: 1,
  linkRequirements: ["-"],
  name: "ZuOOT",
  rarity: "common",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam SEED",
  text: "【Activate･Main】<Support 1> (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)",
  traits: ["zaft"],
  zones: ["earth"],
};
