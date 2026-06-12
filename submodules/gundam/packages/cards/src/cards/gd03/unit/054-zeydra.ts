import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03Zeydra054: UnitCard = {
  cardNumber: "GD03-054",
  name: "Zeydra",
  type: "unit",
  color: "purple",
  traits: ["vagan"],
  id: "GD03-054",
  externalId: "gundam:gd03-054",
  slug: "zeydra-gd03-054",
  displayName: "Zeydra",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-054",
  printings: [
    {
      id: "GD03-054",
      collectorNumber: "GD03-054",
      cardNumber: "GD03-054",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-054.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-054.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-054",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-054.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-054.webp?260424",
  legality: "legal",
  level: 6,
  cost: 5,
  ap: 4,
  hp: 5,
  linkCondition: "[Zeheart Galette]",
  effect:
    "<High-Maneuver> (This Unit can't be blocked.)\n【When Paired･(X-Rounder) Pilot】You may choose 4 (Vagan) cards from your trash. Exile them from the game. If you do, choose 1 enemy Unit that is Lv.4 or lower. Destroy it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
        qualification: {
          attribute: "trait",
          comparison: "includes",
          value: "X-Rounder",
        },
      },
      directives: [
        {
          action: {
            action: "exile",
            target: {
              owner: "friendly",
              zone: "trash",
              count: 4,
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "Vagan" }],
            },
          },
          optional: true,
        },
        {
          action: {
            action: "destroy",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              attributeFilters: [{ attribute: "level", comparison: "lte", value: 4 }],
            },
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【When Paired･(X-Rounder) Pilot】You may choose 4 (Vagan) cards from your trash. Exile them from the game. If you do, choose 1 enemy Unit that is Lv.4 or lower. Destroy it.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "HighManeuver" }],
  rarity: "rare",
};
