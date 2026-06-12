import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd03HowManyMilesToTheBattlefield108: CommandCard = {
  cardNumber: "GD03-108",
  name: "How Many Miles to the Battlefield?",
  type: "command",
  color: "green",
  traits: ["zeon", "cyclops team"],
  id: "GD03-108",
  externalId: "gundam:gd03-108",
  slug: "how-many-miles-to-the-battlefield-gd03-108",
  displayName: "How Many Miles to the Battlefield?",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-108",
  printings: [
    {
      id: "GD03-108",
      collectorNumber: "GD03-108",
      cardNumber: "GD03-108",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-108.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-108.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-108",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-108.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-108.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  pilotName: "Gabriel Ramirez Garcia",
  apBonus: 1,
  hpBonus: 0,
  effect:
    "【Main】Deploy 1 [Hy-Gogg]((Cyclops Team)･AP2･HP1) Unit token.\n【Pilot】[Gabriel Ramirez Garcia]",
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
            token: {
              name: "Hy-Gogg",
              traits: ["cyclops team"],
              ap: 2,
              hp: 1,
              deployState: "active",
            },
          },
        },
      ],
      sourceText:
        "【Main】Deploy 1 [Hy-Gogg]((Cyclops Team)·AP2·HP1) Unit token. 【Pilot】[Gabriel Ramirez Garcia]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
