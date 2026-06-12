import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04VictoryGundam003: UnitCard = {
  cardNumber: "GD04-003",
  name: "Victory Gundam",
  type: "unit",
  color: "blue",
  traits: ["league militaire", "victory type"],
  id: "GD04-003",
  externalId: "gundam:gd04-003",
  slug: "victory-gundam-gd04-003",
  displayName: "Victory Gundam",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-003",
  printings: [
    {
      id: "GD04-003",
      collectorNumber: "GD04-003",
      cardNumber: "GD04-003",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-003.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-003.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-003_p1",
      collectorNumber: "GD04-003_p1",
      cardNumber: "GD04-003",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-003_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-003_p1.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-003",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-003.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-003.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 3,
  hp: 4,
  linkCondition: "(League Militaire) Trait",
  effect: "【Attack】If you have 3 or more (League Militaire) Units in play, draw 1.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
      },
      directives: [
        {
          condition: {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 3,
            hasTrait: "league militaire",
          },
          thenDirectives: [
            {
              action: {
                action: "draw",
                count: 1,
              },
            },
          ],
        },
      ],
      sourceText: "【Attack】If you have 3 or more (League Militaire) Units in play, draw 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
