import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04GnArmorTypeE063: UnitCard = {
  cardNumber: "GD04-063",
  name: "GN Armor Type-E",
  type: "unit",
  color: "purple",
  traits: ["cb", "gn drive"],
  id: "GD04-063",
  externalId: "gundam:gd04-063",
  slug: "gn-armor-type-e-gd04-063",
  displayName: "GN Armor Type-E",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-063",
  printings: [
    {
      id: "GD04-063",
      collectorNumber: "GD04-063",
      cardNumber: "GD04-063",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-063.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-063.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-063",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-063.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-063.webp?260424",
  legality: "legal",
  level: 4,
  cost: 2,
  ap: 3,
  hp: 3,
  linkCondition: "[Setsuna F. Seiei]",
  effect: "【Deploy】Choose 1 enemy Unit that is Lv.1 or lower or has 1 or less AP. Destroy it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "destroy",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "or",
                  filters: [
                    {
                      attribute: "ap",
                      comparison: "lte",
                      value: 1,
                    },
                    {
                      attribute: "level",
                      comparison: "lte",
                      value: 1,
                    },
                  ],
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Deploy】Choose 1 enemy Unit that is Lv.1 or lower or has 1 or less AP. Destroy it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
