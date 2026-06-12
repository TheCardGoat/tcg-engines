import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03DaughtressFlyer044: UnitCard = {
  cardNumber: "GD03-044",
  name: "Daughtress Flyer",
  type: "unit",
  color: "red",
  traits: ["new une"],
  id: "GD03-044",
  externalId: "gundam:gd03-044",
  slug: "daughtress-flyer-gd03-044",
  displayName: "Daughtress Flyer",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-044",
  printings: [
    {
      id: "GD03-044",
      collectorNumber: "GD03-044",
      cardNumber: "GD03-044",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-044.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-044.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-044",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-044.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-044.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 2,
  hp: 3,
  effect: "【Deploy】Deploy 1 rested [Daughtress]((New UNE)･AP0･HP1) Unit token.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "deployToken",
            token: {
              name: "Daughtress",
              traits: ["new une"],
              ap: 0,
              hp: 1,
              deployState: "rested",
            },
          },
        },
      ],
      sourceText: "【Deploy】Deploy 1 rested [Daughtress]((New UNE)·AP0·HP1) Unit token.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
