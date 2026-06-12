import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd04Inspector112: CommandCard = {
  cardNumber: "GD04-112",
  name: "Inspector",
  type: "command",
  color: "red",
  traits: ["earth federation", "cyber-newtype"],
  id: "GD04-112",
  externalId: "gundam:gd04-112",
  slug: "inspector-gd04-112",
  displayName: "Inspector",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-112",
  printings: [
    {
      id: "GD04-112",
      collectorNumber: "GD04-112",
      cardNumber: "GD04-112",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-112.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-112.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-112",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-112.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-112.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  pilotName: "Gates Capa",
  apBonus: 1,
  hpBonus: 1,
  effect: "【Main】Deal 1 damage to all Units that are Lv.2 or lower.\n【Pilot】[Gates Capa]",
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
            amount: 1,
            target: {
              owner: "any",
              cardType: "unit",
              attributeFilters: [{ attribute: "level", comparison: "lte", value: 2 }],
            },
          },
        },
      ],
      sourceText:
        "【Main】Deal 1 damage to all Units that are Lv.2 or lower. 【Pilot】[Gates Capa]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
