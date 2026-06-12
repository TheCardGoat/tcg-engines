import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st05GundamGusionRebake005: UnitCard = {
  cardNumber: "ST05-005",
  name: "Gundam Gusion Rebake",
  type: "unit",
  color: "purple",
  traits: ["tekkadan", "gundam frame"],
  id: "ST05-005",
  externalId: "gundam:st05-005",
  slug: "gundam-gusion-rebake-st05-005",
  displayName: "Gundam Gusion Rebake",
  set: { code: "ST05", name: "Iron Bloom [ST05]", packageId: "616005" },
  printNumber: "ST05-005",
  printings: [
    {
      id: "ST05-005",
      collectorNumber: "ST05-005",
      cardNumber: "ST05-005",
      set: {
        code: "ST05",
        name: "Iron Bloom [ST05]",
        packageId: "616005",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-005.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-005.webp?260424",
      productName: "Iron Bloom [ST05]",
    },
    {
      id: "ST05-005_p1",
      collectorNumber: "ST05-005_p1",
      cardNumber: "ST05-005",
      set: {
        code: "ST05",
        name: "Iron Bloom [ST05] Bonus Pack",
        packageId: "616005",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-005_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-005_p1.webp?260424",
      productName: "Iron Bloom [ST05] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST05-005",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-005.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-005.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 3,
  hp: 4,
  effect: "【Destroyed】Choose 1 enemy Unit with 4 or less AP. Rest it.<br>",
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
                  attribute: "ap",
                  comparison: "lte",
                  value: 4,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Destroyed】Choose 1 enemy Unit with 4 or less AP. Rest it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
