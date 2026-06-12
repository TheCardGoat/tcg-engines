import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03GundamKyriosTailUnitFlightMode030: UnitCard = {
  cardNumber: "GD03-030",
  name: "Gundam Kyrios (Tail Unit Flight Mode)",
  type: "unit",
  color: "green",
  traits: ["cb", "gn drive"],
  id: "GD03-030",
  externalId: "gundam:gd03-030",
  slug: "gundam-kyrios-tail-unit-flight-mode-gd03-030",
  displayName: "Gundam Kyrios (Tail Unit Flight Mode)",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-030",
  printings: [
    {
      id: "GD03-030",
      collectorNumber: "GD03-030",
      cardNumber: "GD03-030",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-030.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-030.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-030",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-030.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-030.webp?260424",
  legality: "legal",
  level: 3,
  cost: 3,
  ap: 3,
  hp: 4,
  linkCondition: "[Allelujah Haptism] / [Hallelujah Haptism]",
  effect: "While you have a (CB) Link Unit in play, this card in your hand gets cost -1.",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            hasTrait: "cb",
            isLinkUnit: true,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "costReduction",
            amount: 1,
            target: {
              owner: "self",
            },
          },
        },
      ],
      sourceText: "While you have a (CB) Link Unit in play, this card in your hand gets cost -1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
