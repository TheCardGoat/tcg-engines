import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03GundamNt1FullArmor007: UnitCard = {
  cardNumber: "GD03-007",
  name: "Gundam NT-1 Full Armor",
  type: "unit",
  color: "blue",
  traits: ["earth federation"],
  id: "GD03-007",
  externalId: "gundam:gd03-007",
  slug: "gundam-nt-1-full-armor-gd03-007",
  displayName: "Gundam NT-1 Full Armor",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-007",
  printings: [
    {
      id: "GD03-007",
      collectorNumber: "GD03-007",
      cardNumber: "GD03-007",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-007.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-007.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-007",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-007.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-007.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 2,
  hp: 3,
  linkCondition: "[Christina Mackenzie]",
  effect: "【Destroyed】Choose 1 enemy Unit with 3 or less HP. Rest it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
      },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "hp",
                  comparison: "lte",
                  value: 3,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Destroyed】Choose 1 enemy Unit with 3 or less HP. Rest it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
