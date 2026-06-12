import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03PenelopeMiddleForm006: UnitCard = {
  cardNumber: "GD03-006",
  name: "Penelope (Middle Form)",
  type: "unit",
  color: "blue",
  traits: ["earth federation"],
  id: "GD03-006",
  externalId: "gundam:gd03-006",
  slug: "penelope-middle-form-gd03-006",
  displayName: "Penelope (Middle Form)",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-006",
  printings: [
    {
      id: "GD03-006",
      collectorNumber: "GD03-006",
      cardNumber: "GD03-006",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-006.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-006.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-006",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-006.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-006.webp?260424",
  legality: "legal",
  level: 6,
  cost: 5,
  ap: 4,
  hp: 4,
  linkCondition: "[Lane Aim]",
  effect: "【Deploy】Choose 1 to 2 enemy Units with 3 or less HP. Rest them.",
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
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "hp",
                  comparison: "lte",
                  value: 3,
                },
              ],
              count: {
                min: 1,
                max: 2,
              },
            },
          },
        },
      ],
      sourceText: "【Deploy】Choose 1 to 2 enemy Units with 3 or less HP. Rest them.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
