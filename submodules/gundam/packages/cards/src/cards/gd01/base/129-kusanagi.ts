import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd01Kusanagi129: BaseCard = {
  cardNumber: "GD01-129",
  name: "Kusanagi",
  type: "base",
  traits: ["triple ship alliance", "warship"],
  id: "GD01-129",
  externalId: "gundam:gd01-129",
  slug: "kusanagi-gd01-129",
  displayName: "Kusanagi",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-129",
  printings: [
    {
      id: "GD01-129",
      collectorNumber: "GD01-129",
      cardNumber: "GD01-129",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-129.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-129.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-129",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-129.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-129.webp?260424",
  legality: "legal",
  level: 4,
  cost: 2,
  hp: 4,
  effect:
    "【Burst】Deploy this card.<br>【Deploy】Add 1 of your Shields to your hand. Then, choose 1 enemy Unit with 3 or less HP. Return it to its owner's hand.<br>",
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
            action: "returnToHand",
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
        "【Deploy】Add 1 of your Shields to your hand. Then, choose 1 enemy Unit with 3 or less HP. Return it to its owner's hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
