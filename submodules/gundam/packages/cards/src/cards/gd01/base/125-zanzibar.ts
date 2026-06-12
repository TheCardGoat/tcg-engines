import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd01Zanzibar125: BaseCard = {
  cardNumber: "GD01-125",
  name: "Zanzibar",
  type: "base",
  traits: ["zeon", "warship"],
  id: "GD01-125",
  externalId: "gundam:gd01-125",
  slug: "zanzibar-gd01-125",
  displayName: "Zanzibar",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-125",
  printings: [
    {
      id: "GD01-125",
      collectorNumber: "GD01-125",
      cardNumber: "GD01-125",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-125.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-125.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-125",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-125.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-125.webp?260424",
  legality: "legal",
  level: 4,
  cost: 2,
  hp: 5,
  effect:
    "【Burst】Deploy this card.<br>【Deploy】Add 1 of your Shields to your hand. Then, if it is your turn, you may deploy 1 (Zeon) Unit card that is Lv.4 or lower from your hand.<br>",
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
            action: "deploy",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "zeon",
                },
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "【Deploy】Add 1 of your Shields to your hand. Then, if it is your turn, you may deploy 1 (Zeon) Unit card that is Lv.4 or lower from your hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
