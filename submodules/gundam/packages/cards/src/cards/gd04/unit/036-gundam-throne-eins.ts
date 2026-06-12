import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04GundamThroneEins036: UnitCard = {
  cardNumber: "GD04-036",
  name: "Gundam Throne Eins",
  type: "unit",
  color: "red",
  traits: ["cb", "trinity"],
  id: "GD04-036",
  externalId: "gundam:gd04-036",
  slug: "gundam-throne-eins-gd04-036",
  displayName: "Gundam Throne Eins",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-036",
  printings: [
    {
      id: "GD04-036",
      collectorNumber: "GD04-036",
      cardNumber: "GD04-036",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-036.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-036.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-036_p1",
      collectorNumber: "GD04-036_p1",
      cardNumber: "GD04-036",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-036_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-036_p1.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-036",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-036.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-036.webp?260424",
  legality: "legal",
  level: 6,
  cost: 4,
  ap: 5,
  hp: 2,
  linkCondition: "(Trinity) Trait",
  effect:
    "【Deploy】You may choose 1 to 2 of your other active (CB) Units. Rest them. If you do, deal damage equal to the number of Units rested with this effect to all enemy Units that are Lv.6 or lower.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 2,
              excludeSource: true,
              state: "active",
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "cb" }],
            },
          },
        },
        {
          action: {
            action: "dealDamageByCount",
            countFilter: {
              owner: "friendly",
              cardType: "unit",
              excludeSource: true,
              state: "rested",
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "cb" }],
            },
            target: {
              owner: "opponent",
              cardType: "unit",
              count: "all",
              attributeFilters: [{ attribute: "level", comparison: "lte", value: 6 }],
            },
          },
        },
      ],
      sourceText:
        "【Deploy】You may choose 1 to 2 of your other active (CB) Units. Rest them. If you do, deal damage equal to the number of Units rested with this effect to all enemy Units that are Lv.6 or lower.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
