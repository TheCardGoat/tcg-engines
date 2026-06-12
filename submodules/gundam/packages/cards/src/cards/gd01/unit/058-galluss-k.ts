import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01GallussK058: UnitCard = {
  cardNumber: "GD01-058",
  name: "Galluss-K",
  type: "unit",
  color: "red",
  traits: ["zeon"],
  id: "GD01-058",
  externalId: "gundam:gd01-058",
  slug: "galluss-k-gd01-058",
  displayName: "Galluss-K",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-058",
  printings: [
    {
      id: "GD01-058",
      collectorNumber: "GD01-058",
      cardNumber: "GD01-058",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-058.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-058.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-058",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-058.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-058.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 3,
  hp: 2,
  effect:
    "【Activate･Action】【Once per Turn】①：Choose 1 Unit that is Lv.4 or higher. It gets AP+1 during this battle.<br>",
  effects: [
    {
      type: "activated",
      activation: {
        timing: ["activate:action"],
        restrictions: [{ type: "oncePerTurn" }],
      },
      cost: {
        payResources: 1,
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 1,
            duration: "thisBattle",
            target: {
              owner: "any",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "gte",
                  value: 4,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Activate·Action】【Once per Turn】①：Choose 1 Unit that is Lv.4 or higher. It gets AP+1 during this battle.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
