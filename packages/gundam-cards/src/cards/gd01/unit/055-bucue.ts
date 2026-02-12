import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Bucue: UnitCardDefinition = {
  ap: 2,
  cardNumber: "GD01-055",
  cardType: "UNIT",
  color: "red",
  cost: 2,
  hp: 3,
  id: "gd01-055",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-055.webp?26013001",
  keywords: [
    {
      keyword: "Support",
      value: 2,
    },
  ],
  level: 3,
  linkRequirements: ["-"],
  name: "BuCUE",
  rarity: "uncommon",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam SEED",
  text: "【Activate･Main】<Support 2> (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)",
  traits: ["zaft"],
  zones: ["earth"],
};
