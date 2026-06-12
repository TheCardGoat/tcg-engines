import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03GundamNt1001: UnitCard = {
  cardNumber: "GD03-001",
  name: "Gundam NT-1",
  type: "unit",
  color: "blue",
  traits: ["earth federation"],
  id: "GD03-001",
  externalId: "gundam:gd03-001",
  slug: "gundam-nt-1-gd03-001",
  displayName: "Gundam NT-1",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-001",
  printings: [
    {
      id: "GD03-001",
      collectorNumber: "GD03-001",
      cardNumber: "GD03-001",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-001.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-001.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-001_p1",
      collectorNumber: "GD03-001_p1",
      cardNumber: "GD03-001",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-001_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-001_p1.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-001",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-001.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-001.webp?260424",
  legality: "legal",
  level: 5,
  cost: 4,
  ap: 4,
  hp: 4,
  linkCondition: "[Christina Mackenzie] / [Amuro Ray]",
  effect:
    "<Repair 2> (At the end of your turn, this Unit recovers the specified number of HP.)\n【When Paired】Choose 1 rested enemy Unit. Deal 1 damage to it. When this effect destroys an enemy Unit, draw 1.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
      },
      directives: [
        {
          action: {
            action: "dealDamageThenDrawIfDestroyed",
            amount: 1,
            target: {
              owner: "opponent",
              cardType: "unit",
              state: "rested",
              count: 1,
            },
            drawCount: 1,
          },
        },
      ],
      sourceText:
        "【When Paired】Choose 1 rested enemy Unit. Deal 1 damage to it. When this effect destroys an enemy Unit, draw 1.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Repair", value: 2 }],
  rarity: "legendRare",
};
