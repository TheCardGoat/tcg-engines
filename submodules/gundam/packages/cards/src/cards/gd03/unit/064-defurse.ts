import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03Defurse064: UnitCard = {
  cardNumber: "GD03-064",
  name: "Defurse",
  type: "unit",
  color: "purple",
  traits: ["ue", "vagan"],
  id: "GD03-064",
  externalId: "gundam:gd03-064",
  slug: "defurse-gd03-064",
  displayName: "Defurse",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-064",
  printings: [
    {
      id: "GD03-064",
      collectorNumber: "GD03-064",
      cardNumber: "GD03-064",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-064.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-064.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-064",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-064.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-064.webp?260424",
  legality: "legal",
  level: 5,
  cost: 4,
  ap: 2,
  hp: 5,
  effect:
    "【Deploy】You may choose 1 (X-Rounder) card from your trash and add it to your hand. If you do, discard 1.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "addFromTrash",
            target: {
              owner: "friendly",
              zone: "trash",
              count: 1,
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "x-rounder",
                },
              ],
            },
          },
          optional: true,
        },
        {
          action: {
            action: "discard",
            count: 1,
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【Deploy】You may choose 1 (X-Rounder) card from your trash and add it to your hand. If you do, discard 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
