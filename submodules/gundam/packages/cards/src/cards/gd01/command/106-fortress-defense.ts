import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd01FortressDefense106: CommandCard = {
  cardNumber: "GD01-106",
  name: "Fortress Defense",
  type: "command",
  color: "green",
  traits: ["zeon"],
  id: "GD01-106",
  externalId: "gundam:gd01-106",
  slug: "fortress-defense-gd01-106",
  displayName: "Fortress Defense",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-106",
  printings: [
    {
      id: "GD01-106",
      collectorNumber: "GD01-106",
      cardNumber: "GD01-106",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-106.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-106.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-106_p1",
      collectorNumber: "GD01-106_p1",
      cardNumber: "GD01-106",
      set: {
        code: "GD01",
        name: "Championship Participation Pack 01",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-106_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-106_p1.webp?260424",
      productName: "Championship Participation Pack 01",
    },
  ],
  selectedPrintingId: "GD01-106",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-106.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-106.webp?260424",
  legality: "legal",
  level: 5,
  cost: 2,
  pilotName: "Dozle Zabi",
  apBonus: 1,
  hpBonus: 0,
  effect: "【Main】Deploy 2 [Zaku Ⅱ]((Zeon)･AP1･HP1) Unit tokens.<br>【Pilot】[Dozle Zabi]<br>",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "deployToken",
            count: 2,
            token: {
              name: "Zaku Ⅱ",
              traits: ["zeon"],
              ap: 1,
              hp: 1,
              deployState: "active",
              printedCardNumber: "T-007",
            },
          },
        },
      ],
      sourceText: "【Main】Deploy 2 [Zaku Ⅱ]((Zeon)·AP1·HP1) Unit tokens. 【Pilot】[Dozle Zabi]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
