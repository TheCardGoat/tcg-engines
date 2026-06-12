import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02RickDiasRed075: UnitCard = {
  cardNumber: "GD02-075",
  name: "Rick Dias (Red)",
  type: "unit",
  color: "white",
  traits: ["aeug"],
  id: "GD02-075",
  externalId: "gundam:gd02-075",
  slug: "rick-dias-red-gd02-075",
  displayName: "Rick Dias (Red)",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-075",
  printings: [
    {
      id: "GD02-075",
      collectorNumber: "GD02-075",
      cardNumber: "GD02-075",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-075.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-075.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-075",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-075.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-075.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 4,
  hp: 3,
  effect:
    "【Attack】Choose 1 active friendly Base. Rest it. If you do, choose 1 enemy Unit that is Lv.4 or lower. It gets AP-2 during this battle.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
      },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "friendly",
              cardType: "base",
              state: "active",
              count: 1,
            },
          },
        },
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: -2,
            duration: "thisBattle",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              attributeFilters: [{ attribute: "level", comparison: "lte", value: 4 }],
            },
          },
          // "If you do, ..." — only apply the AP-debuff if the preceding
          // rest actually landed on a legal target.
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【Attack】Choose 1 active friendly Base. Rest it. If you do, choose 1 enemy Unit that is Lv.4 or lower. It gets AP-2 during this battle.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
