import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd01StealthStratagem116: CommandCard = {
  cardNumber: "GD01-116",
  name: "Stealth Stratagem",
  type: "command",
  color: "red",
  traits: ["zaft", "coordinator"],
  id: "GD01-116",
  externalId: "gundam:gd01-116",
  slug: "stealth-stratagem-gd01-116",
  displayName: "Stealth Stratagem",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-116",
  printings: [
    {
      id: "GD01-116",
      collectorNumber: "GD01-116",
      cardNumber: "GD01-116",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-116.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-116.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-116",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-116.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-116.webp?260424",
  legality: "legal",
  level: 2,
  cost: 1,
  pilotName: "Nicol Amarfi",
  apBonus: 0,
  hpBonus: 1,
  effect:
    "【Main】/【Action】Choose 1 enemy Unit with 2 or less AP. Deal 2 damage to it.<br>【Pilot】[Nicol Amarfi]<br>",
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
            amount: 2,
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "ap",
                  comparison: "lte",
                  value: 2,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Main】/【Action】Choose 1 enemy Unit with 2 or less AP. Deal 2 damage to it. 【Pilot】[Nicol Amarfi]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
