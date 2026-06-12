import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03GundamBarbatosAdapt056: UnitCard = {
  cardNumber: "GD03-056",
  name: "Gundam Barbatos Adapt",
  type: "unit",
  color: "purple",
  traits: ["tekkadan", "gundam frame"],
  id: "GD03-056",
  externalId: "gundam:gd03-056",
  slug: "gundam-barbatos-adapt-gd03-056",
  displayName: "Gundam Barbatos Adapt",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-056",
  printings: [
    {
      id: "GD03-056",
      collectorNumber: "GD03-056",
      cardNumber: "GD03-056",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-056.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-056.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-056_p1",
      collectorNumber: "GD03-056_p1",
      cardNumber: "GD03-056",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-056_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-056_p1.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD03-056",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-056.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-056.webp?260424",
  legality: "legal",
  level: 4,
  cost: 2,
  ap: 2,
  hp: 4,
  linkCondition: "[Mikazuki Augus]",
  effect: "【Deploy】Choose 1 of your Units and 1 enemy Unit. Deal 1 damage to them.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
            },
          },
        },
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Deploy】Choose 1 of your Units and 1 enemy Unit. Deal 1 damage to them.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
export const gd04GundamBarbatosAdapt056 = gd03GundamBarbatosAdapt056;
