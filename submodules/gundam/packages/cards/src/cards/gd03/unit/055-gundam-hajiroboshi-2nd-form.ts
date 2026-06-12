import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03GundamHajiroboshi2ndForm055: UnitCard = {
  cardNumber: "GD03-055",
  name: "Gundam Hajiroboshi (2nd Form)",
  type: "unit",
  color: "purple",
  traits: ["civilian", "gundam frame"],
  id: "GD03-055",
  externalId: "gundam:gd03-055",
  slug: "gundam-hajiroboshi-2nd-form-gd03-055",
  displayName: "Gundam Hajiroboshi (2nd Form)",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-055",
  printings: [
    {
      id: "GD03-055",
      collectorNumber: "GD03-055",
      cardNumber: "GD03-055",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-055.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-055.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-055_p1",
      collectorNumber: "GD03-055_p1",
      cardNumber: "GD03-055",
      set: {
        code: "GD03",
        name: "WORLD CHAMPIONSHIPS 26-27 Participation Pack 26-27 Vol.1",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-055_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-055_p1.webp?260424",
      productName: "WORLD CHAMPIONSHIPS 26-27 Participation Pack 26-27 Vol.1",
    },
  ],
  selectedPrintingId: "GD03-055",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-055.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-055.webp?260424",
  legality: "legal",
  level: 4,
  cost: 2,
  ap: 4,
  hp: 3,
  linkCondition: "[Wistario Afam]",
  effect: "【When Paired･Purple Pilot】Choose 1 enemy Unit that is Lv.2 or lower. Destroy it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
        qualification: {
          attribute: "color",
          comparison: "eq",
          value: "purple",
        },
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
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【When Paired·Purple Pilot】Choose 1 enemy Unit that is Lv.2 or lower. Destroy it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
