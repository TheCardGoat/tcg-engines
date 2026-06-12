import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd02Alexandria122: BaseCard = {
  cardNumber: "GD02-122",
  name: "Alexandria",
  type: "base",
  traits: ["titans", "warship"],
  id: "GD02-122",
  externalId: "gundam:gd02-122",
  slug: "alexandria-gd02-122",
  displayName: "Alexandria",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-122",
  printings: [
    {
      id: "GD02-122",
      collectorNumber: "GD02-122",
      cardNumber: "GD02-122",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-122.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-122.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-122",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-122.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-122.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  hp: 5,
  effect:
    "【Burst】Deploy this card.<br>【Deploy】Add 1 of your Shields to your hand. Then, choose 1 rested enemy Unit that is Lv.4 or lower. Deal 1 damage to it.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "deploySelf",
          },
        },
      ],
      sourceText: "【Burst】Deploy this card.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "addShieldToHand",
            count: 1,
          },
        },
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "opponent",
              cardType: "unit",
              state: "rested",
              count: { min: 0, max: 1 },
              attributeFilters: [{ attribute: "level", comparison: "lte", value: 4 }],
            },
          },
        },
      ],
      sourceText:
        "【Deploy】Add 1 of your Shields to your hand. Then, choose 1 rested enemy Unit that is Lv.4 or lower. Deal 1 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
