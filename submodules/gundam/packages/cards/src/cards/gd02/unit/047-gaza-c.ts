import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02GazaC047: UnitCard = {
  cardNumber: "GD02-047",
  name: "Gaza C",
  type: "unit",
  color: "red",
  traits: ["neo zeon"],
  id: "GD02-047",
  externalId: "gundam:gd02-047",
  slug: "gaza-c-gd02-047",
  displayName: "Gaza C",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-047",
  printings: [
    {
      id: "GD02-047",
      collectorNumber: "GD02-047",
      cardNumber: "GD02-047",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-047.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-047.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-047",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-047.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-047.webp?260424",
  legality: "legal",
  level: 1,
  cost: 1,
  ap: 0,
  hp: 1,
  effect:
    "【Activate･Main】Rest this Unit：Destroy this and choose 1 enemy Unit that is Lv.5 or lower. Deal 1 damage to it.<br>",
  effects: [
    {
      type: "activated",
      activation: {
        timing: ["activate:main"],
      },
      cost: {
        restSelf: true,
      },
      directives: [
        {
          action: {
            action: "destroy",
            target: {
              owner: "self",
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
              attributeFilters: [{ attribute: "level", comparison: "lte", value: 5 }],
            },
          },
        },
      ],
      sourceText:
        "【Activate·Main】Rest this Unit：Destroy this and choose 1 enemy Unit that is Lv.5 or lower. Deal 1 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
