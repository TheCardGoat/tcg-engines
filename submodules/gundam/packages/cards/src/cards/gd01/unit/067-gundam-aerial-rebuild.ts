import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01GundamAerialRebuild067: UnitCard = {
  cardNumber: "GD01-067",
  name: "Gundam Aerial Rebuild",
  type: "unit",
  color: "white",
  traits: ["academy"],
  id: "GD01-067",
  externalId: "gundam:gd01-067",
  slug: "gundam-aerial-rebuild-gd01-067",
  displayName: "Gundam Aerial Rebuild",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-067",
  printings: [
    {
      id: "GD01-067",
      collectorNumber: "GD01-067",
      cardNumber: "GD01-067",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-067.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-067.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-067_p1",
      collectorNumber: "GD01-067_p1",
      cardNumber: "GD01-067",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-067_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-067_p1.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-067_p2",
      collectorNumber: "GD01-067_p2",
      cardNumber: "GD01-067",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-067_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-067_p2.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-067_p3",
      collectorNumber: "GD01-067_p3",
      cardNumber: "GD01-067",
      set: {
        code: "GD01",
        name: "Newtype Challenge 2025 Mission1",
        packageId: "616901",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-067_p3.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-067_p3.webp?260424",
      productName: "Newtype Challenge 2025 Mission1",
    },
  ],
  selectedPrintingId: "GD01-067",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-067.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-067.webp?260424",
  legality: "legal",
  level: 6,
  cost: 5,
  ap: 5,
  hp: 4,
  linkCondition: "[Suletta Mercury]",
  effect:
    "【When Paired】Choose 1 Command card that is Lv.5 or lower from your trash. Add it to your hand.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
      },
      directives: [
        {
          action: {
            action: "addFromTrash",
            target: {
              owner: "friendly",
              cardType: "command",
              zone: "trash",
              count: 1,
              attributeFilters: [{ attribute: "level", comparison: "lte", value: 5 }],
            },
          },
        },
      ],
      sourceText:
        "【When Paired】Choose 1 Command card that is Lv.5 or lower from your trash. Add it to your hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
