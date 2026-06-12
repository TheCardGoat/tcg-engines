import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01WingGundamZero024: UnitCard = {
  cardNumber: "GD01-024",
  name: "Wing Gundam Zero",
  type: "unit",
  color: "green",
  traits: ["g team"],
  id: "GD01-024",
  externalId: "gundam:gd01-024",
  slug: "wing-gundam-zero-gd01-024",
  displayName: "Wing Gundam Zero",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-024",
  printings: [
    {
      id: "GD01-024",
      collectorNumber: "GD01-024",
      cardNumber: "GD01-024",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-024.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-024.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-024_p1",
      collectorNumber: "GD01-024_p1",
      cardNumber: "GD01-024",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-024_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-024_p1.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-024_p2",
      collectorNumber: "GD01-024_p2",
      cardNumber: "GD01-024",
      set: {
        code: "GD01",
        name: "Championship Winner Card 01",
        packageId: "616901",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-024_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-024_p2.webp?260424",
      productName: "Championship Winner Card 01",
    },
  ],
  selectedPrintingId: "GD01-024",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-024.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-024.webp?260424",
  legality: "legal",
  level: 8,
  cost: 8,
  ap: 5,
  hp: 7,
  linkCondition: "[Heero Yuy]",
  effect:
    "<High-Maneuver> (This Unit can't be blocked.)\n【Deploy】Deal 3 damage to all Units that are Lv.5 or lower.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "dealDamageAll",
            amount: 3,
            target: {
              owner: "any",
              cardType: "unit",
              attributeFilters: [{ attribute: "level", comparison: "lte", value: 5 }],
            },
          },
        },
      ],
      sourceText: "【Deploy】Deal 3 damage to all Units that are Lv.5 or lower.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "HighManeuver" }],
  rarity: "legendRare",
};
