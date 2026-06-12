import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01UnicornGundamDestroyMode002: UnitCard = {
  cardNumber: "GD01-002",
  name: "Unicorn Gundam (Destroy Mode)",
  type: "unit",
  color: "blue",
  traits: ["civilian"],
  id: "GD01-002",
  externalId: "gundam:gd01-002",
  slug: "unicorn-gundam-destroy-mode-gd01-002",
  displayName: "Unicorn Gundam (Destroy Mode)",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-002",
  printings: [
    {
      id: "GD01-002",
      collectorNumber: "GD01-002",
      cardNumber: "GD01-002",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-002.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-002.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-002_p1",
      collectorNumber: "GD01-002_p1",
      cardNumber: "GD01-002",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-002_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-002_p1.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-002_p2",
      collectorNumber: "GD01-002_p2",
      cardNumber: "GD01-002",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-002_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-002_p2.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD01-002",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-002.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-002.webp?260424",
  legality: "legal",
  level: 7,
  cost: 6,
  ap: 5,
  hp: 4,
  linkCondition: "[Banagher Links]",
  effect:
    'When playing this card from your hand, you may destroy 1 of your Link Units with "Unicorn Mode" in its card name that is Lv.5. If you do, play this card as if it has 0 Lv. and cost.\n【Attack】Choose 1 enemy Unit. Rest it.',
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
      },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Attack】Choose 1 enemy Unit. Rest it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
export const gd04UnicornGundamDestroyMode002 = gd01UnicornGundamDestroyMode002;
