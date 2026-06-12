import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04Guncannon108Guncannon109009: UnitCard = {
  cardNumber: "GD04-009",
  name: "Guncannon (108) & Guncannon (109)",
  type: "unit",
  color: "blue",
  traits: ["earth federation", "white base team"],
  id: "GD04-009",
  externalId: "gundam:gd04-009",
  slug: "guncannon-108-guncannon-109-gd04-009",
  displayName: "Guncannon (108) & Guncannon (109)",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-009",
  printings: [
    {
      id: "GD04-009",
      collectorNumber: "GD04-009",
      cardNumber: "GD04-009",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-009.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-009.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-009_p1",
      collectorNumber: "GD04-009_p1",
      cardNumber: "GD04-009",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-009_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-009_p1.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-009",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-009.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-009.webp?260424",
  legality: "legal",
  level: 5,
  cost: 4,
  ap: 3,
  hp: 4,
  linkCondition: "[Kai Shiden] / [Hayato Kobayashi]",
  effect:
    "【When Linked】Choose 1 of your other (White Base Team) Units that is Lv.4 or higher. Set it as active.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenLinked"],
      },
      directives: [
        {
          action: {
            action: "setActive",
            target: {
              owner: "friendly",
              cardType: "unit",
              excludeSource: true,
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "gte",
                  value: 4,
                },
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "white base team",
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【When Linked】Choose 1 of your other (White Base Team) Units that is Lv.4 or higher. Set it as active.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
