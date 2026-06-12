import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st01Guntank004: UnitCard = {
  cardNumber: "ST01-004",
  name: "Guntank",
  type: "unit",
  color: "blue",
  traits: ["earth federation", "white base team"],
  id: "ST01-004",
  externalId: "gundam:st01-004",
  slug: "guntank-st01-004",
  displayName: "Guntank",
  set: { code: "ST01", name: "Heroic Beginnings [ST01]", packageId: "616001" },
  printNumber: "ST01-004",
  printings: [
    {
      id: "ST01-004",
      collectorNumber: "ST01-004",
      cardNumber: "ST01-004",
      set: {
        code: "ST01",
        name: "Heroic Beginnings [ST01]",
        packageId: "616001",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st01/ST01-004.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-004.webp?260424",
      productName: "Heroic Beginnings [ST01]",
    },
    {
      id: "ST01-004_p1",
      collectorNumber: "ST01-004_p1",
      cardNumber: "ST01-004",
      set: {
        code: "ST01",
        name: "Heroic Beginnings [ST01] Bonus Pack",
        packageId: "616001",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st01/ST01-004_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-004_p1.webp?260424",
      productName: "Heroic Beginnings [ST01] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST01-004",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st01/ST01-004.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-004.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 2,
  hp: 3,
  effect: "【Deploy】Choose 1 enemy Unit with 2 or less HP. Rest it.<br>",
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
                  value: 2,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Deploy】Choose 1 enemy Unit with 2 or less HP. Rest it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
