import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02GundamBarbatos3rdForm068: UnitCard = {
  cardNumber: "GD02-068",
  name: "Gundam Barbatos 3rd Form",
  type: "unit",
  color: "purple",
  traits: ["tekkadan", "gundam frame"],
  id: "GD02-068",
  externalId: "gundam:gd02-068",
  slug: "gundam-barbatos-3rd-form-gd02-068",
  displayName: "Gundam Barbatos 3rd Form",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-068",
  printings: [
    {
      id: "GD02-068",
      collectorNumber: "GD02-068",
      cardNumber: "GD02-068",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-068.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-068.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-068",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-068.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-068.webp?260424",
  legality: "legal",
  level: 4,
  cost: 2,
  ap: 3,
  hp: 5,
  effect: "【Deploy】Deal 2 damage to this Unit.<br>",
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
            amount: 2,
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText: "【Deploy】Deal 2 damage to this Unit.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
