import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd01NahelArgama123: BaseCard = {
  cardNumber: "GD01-123",
  name: "Nahel Argama",
  type: "base",
  traits: ["earth federation", "warship"],
  id: "GD01-123",
  externalId: "gundam:gd01-123",
  slug: "nahel-argama-gd01-123",
  displayName: "Nahel Argama",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-123",
  printings: [
    {
      id: "GD01-123",
      collectorNumber: "GD01-123",
      cardNumber: "GD01-123",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-123.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-123.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-123",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-123.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-123.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  hp: 5,
  effect:
    "【Burst】Deploy this card.<br>【Deploy】Add 1 of your Shields to your hand. Then, choose 1 enemy Unit with 3 or less HP. Rest it.<br>",
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
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              attributeFilters: [
                {
                  attribute: "hp",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "【Deploy】Add 1 of your Shields to your hand. Then, choose 1 enemy Unit with 3 or less HP. Rest it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
