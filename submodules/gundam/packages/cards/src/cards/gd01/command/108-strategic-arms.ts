import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd01StrategicArms108: CommandCard = {
  cardNumber: "GD01-108",
  name: "Strategic Arms",
  type: "command",
  color: "green",
  traits: ["-"],
  id: "GD01-108",
  externalId: "gundam:gd01-108",
  slug: "strategic-arms-gd01-108",
  displayName: "Strategic Arms",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-108",
  printings: [
    {
      id: "GD01-108",
      collectorNumber: "GD01-108",
      cardNumber: "GD01-108",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-108.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-108.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-108",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-108.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-108.webp?260424",
  legality: "legal",
  level: 6,
  cost: 6,
  effect: "【Main】Deal 2 damage to all Units with &lt;Blocker&gt;.<br>",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "dealDamageAll",
            amount: 2,
            target: {
              owner: "any",
              cardType: "unit",
              hasKeyword: "Blocker",
            },
          },
        },
      ],
      sourceText: "【Main】Deal 2 damage to all Units with <Blocker>.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
