import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd01ZeonRemnantForces115: CommandCard = {
  cardNumber: "GD01-115",
  name: "Zeon Remnant Forces",
  type: "command",
  color: "red",
  traits: ["-"],
  id: "GD01-115",
  externalId: "gundam:gd01-115",
  slug: "zeon-remnant-forces-gd01-115",
  displayName: "Zeon Remnant Forces",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-115",
  printings: [
    {
      id: "GD01-115",
      collectorNumber: "GD01-115",
      cardNumber: "GD01-115",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-115.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-115.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-115",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-115.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-115.webp?260424",
  legality: "legal",
  level: 2,
  cost: 1,
  effect: "【Main】/【Action】Choose 1 enemy Unit. Deal 1 damage to it.<br>",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
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
            },
          },
        },
      ],
      sourceText: "【Main】/【Action】Choose 1 enemy Unit. Deal 1 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
