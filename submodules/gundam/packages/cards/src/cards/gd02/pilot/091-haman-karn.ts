import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd02HamanKarn091: PilotCard = {
  cardNumber: "GD02-091",
  name: "Haman Karn",
  type: "pilot",
  color: "red",
  traits: ["neo zeon", "newtype"],
  id: "GD02-091",
  externalId: "gundam:gd02-091",
  slug: "haman-karn-gd02-091",
  displayName: "Haman Karn",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-091",
  printings: [
    {
      id: "GD02-091",
      collectorNumber: "GD02-091",
      cardNumber: "GD02-091",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-091.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-091.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-091_p1",
      collectorNumber: "GD02-091_p1",
      cardNumber: "GD02-091",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-091_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-091_p1.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-091_p2",
      collectorNumber: "GD02-091_p2",
      cardNumber: "GD02-091",
      set: {
        code: "GD02",
        name: "Event",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-091_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-091_p2.webp?260424",
      productName: "Event",
    },
    {
      id: "GD02-091_p3",
      collectorNumber: "GD02-091_p3",
      cardNumber: "GD02-091",
      set: {
        code: "GD02",
        name: "Newtype Challenge 2025 Mission 3",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-091_p3.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-091_p3.webp?260424",
      productName: "Newtype Challenge 2025 Mission 3",
    },
  ],
  selectedPrintingId: "GD02-091",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-091.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-091.webp?260424",
  legality: "legal",
  level: 5,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.<br>【When Paired】If this Unit is red, choose 1 enemy Unit whose Lv. is equal to or lower than this Unit. Deal 1 damage to it.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "addSelfToHand",
          },
        },
      ],
      sourceText: "【Burst】Add this card to your hand.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
        conditions: [{ type: "selfIsColor", color: "red" }],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: { ref: "source", stat: "level" },
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "【When Paired】If this Unit is red, choose 1 enemy Unit whose Lv. is equal to or lower than this Unit. Deal 1 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
