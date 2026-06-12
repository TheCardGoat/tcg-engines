import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03Hambrabi004: UnitCard = {
  cardNumber: "GD03-004",
  name: "Hambrabi",
  type: "unit",
  color: "blue",
  traits: ["titans"],
  id: "GD03-004",
  externalId: "gundam:gd03-004",
  slug: "hambrabi-gd03-004",
  displayName: "Hambrabi",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-004",
  printings: [
    {
      id: "GD03-004",
      collectorNumber: "GD03-004",
      cardNumber: "GD03-004",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-004.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-004.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-004",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-004.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-004.webp?260424",
  legality: "legal",
  level: 5,
  cost: 4,
  ap: 5,
  hp: 3,
  linkCondition: "[Yazan Gable]",
  effect:
    "【Attack】If you have 2 or more other (Titans) Units in play, choose 1 enemy Unit with 5 or less HP. Rest it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 2,
            hasTrait: "titans",
            excludeSelf: true,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              attributeFilters: [
                {
                  attribute: "hp",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "【Attack】If you have 2 or more other (Titans) Units in play, choose 1 enemy Unit with 5 or less HP. Rest it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
