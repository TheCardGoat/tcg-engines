import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02GundamGusionRebake055: UnitCard = {
  cardNumber: "GD02-055",
  name: "Gundam Gusion Rebake",
  type: "unit",
  color: "purple",
  traits: ["tekkadan", "gundam frame"],
  id: "GD02-055",
  externalId: "gundam:gd02-055",
  slug: "gundam-gusion-rebake-gd02-055",
  displayName: "Gundam Gusion Rebake",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-055",
  printings: [
    {
      id: "GD02-055",
      collectorNumber: "GD02-055",
      cardNumber: "GD02-055",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-055.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-055.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-055_p1",
      collectorNumber: "GD02-055_p1",
      cardNumber: "GD02-055",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-055_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-055_p1.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-055",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-055.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-055.webp?260424",
  legality: "legal",
  level: 5,
  cost: 4,
  ap: 3,
  hp: 5,
  linkCondition: "[Akihiro Altland]",
  effect:
    "<Blocker> (Rest this Unit to change the attack target to it.)\n【Deploy】Choose 1 of your Units and 1 enemy Unit. Deal 1 damage to them.",
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
  keywordEffects: [{ keyword: "Blocker" }],
  rarity: "legendRare",
};
