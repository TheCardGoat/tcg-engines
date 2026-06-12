import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04Alvatore080: UnitCard = {
  cardNumber: "GD04-080",
  name: "Alvatore",
  type: "unit",
  color: "white",
  traits: ["un"],
  id: "GD04-080",
  externalId: "gundam:gd04-080",
  slug: "alvatore-gd04-080",
  displayName: "Alvatore",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-080",
  printings: [
    {
      id: "GD04-080",
      collectorNumber: "GD04-080",
      cardNumber: "GD04-080",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-080.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-080.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-080",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-080.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-080.webp?260424",
  legality: "legal",
  level: 4,
  cost: 4,
  ap: 4,
  hp: 4,
  linkCondition: "[Alejandro Corner]",
  effect:
    "【Destroyed】If you have another (UN)/(Superpower Bloc) Unit in play, deploy 1 rested [Alvaaron]((UN)･AP4･HP1) Unit token.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
        conditions: [
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            hasTrait: ["un", "superpower bloc"],
            excludeSelf: true,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "deployToken",
            token: {
              name: "Alvaaron",
              traits: ["un"],
              ap: 4,
              hp: 1,
              deployState: "rested",
            },
          },
        },
      ],
      sourceText:
        "【Destroyed】If you have another (UN)/(Superpower Bloc) Unit in play, deploy 1 rested [Alvaaron]((UN)·AP4·HP1) Unit token.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
