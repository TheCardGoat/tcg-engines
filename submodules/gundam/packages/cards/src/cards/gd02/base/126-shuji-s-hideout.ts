import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd02ShujiSHideout126: BaseCard = {
  cardNumber: "GD02-126",
  name: "Shuji's Hideout",
  type: "base",
  traits: ["clan", "stronghold"],
  id: "GD02-126",
  externalId: "gundam:gd02-126",
  slug: "shuji-s-hideout-gd02-126",
  displayName: "Shuji's Hideout",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-126",
  printings: [
    {
      id: "GD02-126",
      collectorNumber: "GD02-126",
      cardNumber: "GD02-126",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-126.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-126.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-126",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-126.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-126.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  hp: 5,
  effect:
    "【Burst】Deploy this card.<br>【Deploy】Add 1 of your Shields to your hand.<br>\n【Destroyed】Choose 1 enemy Unit that is Lv.4 or lower. Deal 1 damage to it.<br>",
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
      ],
      sourceText: "【Deploy】Add 1 of your Shields to your hand.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 4,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Destroyed】Choose 1 enemy Unit that is Lv.4 or lower. Deal 1 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
