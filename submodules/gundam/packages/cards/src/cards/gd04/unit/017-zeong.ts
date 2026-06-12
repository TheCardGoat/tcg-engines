import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04Zeong017: UnitCard = {
  cardNumber: "GD04-017",
  name: "Zeong",
  type: "unit",
  color: "green",
  traits: ["zeon"],
  id: "GD04-017",
  externalId: "gundam:gd04-017",
  slug: "zeong-gd04-017",
  displayName: "Zeong",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-017",
  printings: [
    {
      id: "GD04-017",
      collectorNumber: "GD04-017",
      cardNumber: "GD04-017",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-017.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-017.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-017_p1",
      collectorNumber: "GD04-017_p1",
      cardNumber: "GD04-017",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-017_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-017_p1.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-017_p2",
      collectorNumber: "GD04-017_p2",
      cardNumber: "GD04-017",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-017_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-017_p2.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-017",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-017.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-017.webp?260424",
  legality: "legal",
  level: 6,
  cost: 5,
  ap: 4,
  hp: 3,
  linkCondition: "[Char Aznable]",
  effect:
    "【When Paired･(Newtype) Pilot】Deploy 2 [Wire-Guided Arm]((Zeon)･AP2･HP1・This Unit can't be paired with a Pilot) Unit tokens.\n【Destroyed】Deploy 1 rested [Zeong (Head)]((Zeon)･AP3･HP1) Unit token.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
        qualification: {
          attribute: "trait",
          comparison: "includes",
          value: "newtype",
        },
      },
      directives: [
        {
          action: {
            action: "deployToken",
            token: {
              name: "Wire-Guided Arm",
              traits: ["zeon"],
              ap: 2,
              hp: 1,
              deployState: "active",
            },
            count: 2,
          },
        },
      ],
      sourceText:
        "【When Paired·(Newtype) Pilot】Deploy 2 [Wire-Guided Arm]((Zeon)·AP2·HP1・This Unit can't be paired with a Pilot) Unit tokens.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
      },
      directives: [
        {
          action: {
            action: "deployToken",
            token: {
              name: "Zeong (Head)",
              traits: ["zeon"],
              ap: 3,
              hp: 1,
              deployState: "rested",
            },
          },
        },
      ],
      sourceText: "【Destroyed】Deploy 1 rested [Zeong (Head)]((Zeon)·AP3·HP1) Unit token.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
