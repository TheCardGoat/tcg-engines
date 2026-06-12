import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01Gyan032: UnitCard = {
  cardNumber: "GD01-032",
  name: "Gyan",
  type: "unit",
  color: "green",
  traits: ["zeon"],
  id: "GD01-032",
  externalId: "gundam:gd01-032",
  slug: "gyan-gd01-032",
  displayName: "Gyan",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-032",
  printings: [
    {
      id: "GD01-032",
      collectorNumber: "GD01-032",
      cardNumber: "GD01-032",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-032.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-032.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-032",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-032.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-032.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 4,
  hp: 3,
  effect:
    "【When Paired･(Zeon) Pilot】Choose 1 enemy Unit with &lt;Blocker&gt; that is Lv.2 or lower. Destroy it.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
        qualification: { attribute: "trait", comparison: "includes", value: "zeon" },
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
                  attribute: "level",
                  comparison: "lte",
                  value: 2,
                },
              ],
              hasKeyword: "Blocker",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【When Paired·(Zeon) Pilot】Choose 1 enemy Unit with <Blocker> that is Lv.2 or lower. Destroy it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
