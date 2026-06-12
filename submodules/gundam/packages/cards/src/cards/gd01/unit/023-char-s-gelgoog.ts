import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01CharSGelgoog023: UnitCard = {
  cardNumber: "GD01-023",
  name: "Char's Gelgoog",
  type: "unit",
  color: "green",
  traits: ["zeon"],
  id: "GD01-023",
  externalId: "gundam:gd01-023",
  slug: "char-s-gelgoog-gd01-023",
  displayName: "Char's Gelgoog",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-023",
  printings: [
    {
      id: "GD01-023",
      collectorNumber: "GD01-023",
      cardNumber: "GD01-023",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-023.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-023.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-023_p1",
      collectorNumber: "GD01-023_p1",
      cardNumber: "GD01-023",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-023_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-023_p1.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-023",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-023.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-023.webp?260424",
  legality: "legal",
  level: 4,
  cost: 4,
  ap: 4,
  hp: 3,
  linkCondition: "[Char Aznable]",
  effect:
    "【Activate･Main】Discard 1 (Zeon)/(Neo Zeon) Unit card：If a Pilot is not paired with this Unit, choose 1 (Newtype) Pilot card that is Lv.3 or lower from your trash. Pair it with this Unit.",
  effects: [
    {
      type: "activated",
      activation: {
        timing: ["activate:main"],
        conditions: [{ type: "selfIsUnpaired" }],
      },
      cost: {
        discardCount: 1,
        discardFilter: {
          owner: "friendly",
          zone: "hand",
          cardType: "unit",
          count: 1,
          attributeFilters: [
            {
              attribute: "or",
              filters: [
                { attribute: "trait", comparison: "includes", value: "zeon" },
                { attribute: "trait", comparison: "includes", value: "neo zeon" },
              ],
            },
          ],
        },
      },
      directives: [
        {
          action: {
            action: "pairPilot",
            target: {
              owner: "friendly",
              cardType: "pilot",
              zone: "trash",
              count: 1,
              attributeFilters: [
                { attribute: "trait", comparison: "includes", value: "newtype" },
                { attribute: "level", comparison: "lte", value: 3 },
              ],
            },
          },
        },
      ],
      sourceText:
        "【Activate·Main】Discard 1 (Zeon)/(Neo Zeon) Unit card：If a Pilot is not paired with this Unit, choose 1 (Newtype) Pilot card that is Lv.3 or lower from your trash. Pair it with this Unit.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
