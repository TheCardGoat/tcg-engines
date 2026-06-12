import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd01DeepDevotion101: CommandCard = {
  cardNumber: "GD01-101",
  name: "Deep Devotion",
  type: "command",
  color: "blue",
  traits: ["oz"],
  id: "GD01-101",
  externalId: "gundam:gd01-101",
  slug: "deep-devotion-gd01-101",
  displayName: "Deep Devotion",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-101",
  printings: [
    {
      id: "GD01-101",
      collectorNumber: "GD01-101",
      cardNumber: "GD01-101",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-101.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-101.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-101",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-101.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-101.webp?260424",
  legality: "legal",
  level: 2,
  cost: 1,
  pilotName: "Lucrezia Noin",
  apBonus: 1,
  hpBonus: 0,
  effect:
    "【Main】/【Action】Choose 1 friendly Link Unit. It recovers 3 HP.<br>【Pilot】[Lucrezia Noin]<br>",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          action: {
            action: "recoverHP",
            amount: 3,
            target: {
              owner: "friendly",
              cardType: "unit",
              isLinkUnit: true,
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Main】/【Action】Choose 1 friendly Link Unit. It recovers 3 HP. 【Pilot】[Lucrezia Noin]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
