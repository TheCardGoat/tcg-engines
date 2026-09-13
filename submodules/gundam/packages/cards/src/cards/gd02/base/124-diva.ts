import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd02Diva124: BaseCard = {
  cardNumber: "GD02-124",
  name: "Diva",
  type: "base",
  color: "green",
  traits: ["earth federation", "warship"],
  id: "GD02-124",
  canonicalId: "GD02-124",
  externalIds: { bandai: "gundam:gd02-124" },
  slug: "diva/gd02-124",
  displayName: "Diva",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-124",
  printings: [
    {
      id: "GD02-124",
      artId: "GD02-124",
      setCode: "GD02",
      collectorNumber: "GD02-124",
      cardNumber: "GD02-124",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd02/GD02-124.webp",
      productName: "Dual Impact [GD02]",
    },
  ],
  reprints: ["GD02-124"],
  selectedPrintingId: "GD02-124",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd02/GD02-124.webp",
  legality: "legal",
  level: 3,
  cost: 1,
  hp: 5,
  battlefieldZones: ["space", "earth"],
  effect:
    "【Burst】Deploy this card.<br>【Deploy】Add 1 of your Shields to your hand.<br>\nDuring your turn, while you are Lv.7 or higher, all friendly green (Earth Federation) Units get AP+1.<br>",
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
      type: "constant",
      activation: {
        conditions: [
          { type: "isTurn", whose: "friendly" },
          { type: "playerLevel", comparison: "gte", value: 7 },
        ],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 1,
            duration: "permanent",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: "all",
              attributeFilters: [
                {
                  attribute: "color",
                  comparison: "eq",
                  value: "green",
                },
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "earth federation",
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "During your turn, while you are Lv.7 or higher, all friendly green (Earth Federation) Units get AP+1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
