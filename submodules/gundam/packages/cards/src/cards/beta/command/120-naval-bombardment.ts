import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const betaNavalBombardment120: CommandCard = {
  cardNumber: "GD01-120",
  name: "Naval Bombardment",
  type: "command",
  color: "white",
  traits: ["-"],
  id: "GD01-120_p1",
  externalId: "gundam:gd01-120_p1",
  slug: "naval-bombardment-gd01-120-p1",
  displayName: "Naval Bombardment",
  set: { code: "BETA", name: "Edition Beta", packageId: "616000" },
  printNumber: "GD01-120_p1",
  printings: [
    {
      id: "GD01-120",
      collectorNumber: "GD01-120",
      cardNumber: "GD01-120",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-120.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-120.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-120_p1",
      collectorNumber: "GD01-120_p1",
      cardNumber: "GD01-120",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/GD01-120_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-120_p1.webp?260424",
      productName: "Edition Beta",
    },
  ],
  selectedPrintingId: "GD01-120_p1",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/GD01-120_p1.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-120_p1.webp?260424",
  legality: "legal",
  level: 2,
  cost: 1,
  effect:
    "【Burst】Choose 1 enemy Unit. It gets AP-3 during this turn.<br>【Action】Choose 1 friendly Unit with &lt;Blocker&gt;. It gets AP+3 during this turn.<br>",
  effects: [
    {
      type: "triggered",
      activation: { timing: ["burst"] },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: -3,
            duration: "thisTurn",
            target: { owner: "opponent", cardType: "unit", count: 1 },
          },
        },
      ],
      sourceText: "【Burst】Choose 1 enemy Unit. It gets AP-3 during this turn.",
    },
    {
      type: "command",
      activation: { timing: ["action"] },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 3,
            duration: "thisTurn",
            target: { owner: "friendly", cardType: "unit", count: 1, hasKeyword: "Blocker" },
          },
        },
      ],
      sourceText: "【Action】Choose 1 friendly Unit with <Blocker>. It gets AP+3 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
