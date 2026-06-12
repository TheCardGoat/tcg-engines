import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02Zedas057: UnitCard = {
  cardNumber: "GD02-057",
  name: "Zedas",
  type: "unit",
  color: "purple",
  traits: ["ue", "vagan"],
  id: "GD02-057",
  externalId: "gundam:gd02-057",
  slug: "zedas-gd02-057",
  displayName: "Zedas",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-057",
  printings: [
    {
      id: "GD02-057",
      collectorNumber: "GD02-057",
      cardNumber: "GD02-057",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-057.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-057.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-057",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-057.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-057.webp?260424",
  legality: "legal",
  level: 5,
  cost: 3,
  ap: 5,
  hp: 3,
  effect:
    "【During Pair】【Attack】You may choose 1 of your other Units. Destroy it. If you do, choose 1 enemy Unit that is Lv.4 or lower. Deal 2 damage to it.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [{ type: "duringPair" }],
      },
      directives: [
        {
          action: {
            action: "destroy",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              excludeSource: true,
            },
          },
          optional: true,
        },
        {
          action: {
            action: "dealDamage",
            amount: 2,
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              attributeFilters: [{ attribute: "level", comparison: "lte", value: 4 }],
            },
          },
          // "If you do, ..." — only deal damage if the preceding optional
          // destroy actually resolved (controller opted in AND the
          // destroy found a legal target).
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【During Pair】【Attack】You may choose 1 of your other Units. Destroy it. If you do, choose 1 enemy Unit that is Lv.4 or lower. Deal 2 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
