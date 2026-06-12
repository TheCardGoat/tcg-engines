import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03MesserTypeF02043: UnitCard = {
  cardNumber: "GD03-043",
  name: "Messer Type-F02",
  type: "unit",
  color: "red",
  traits: ["mafty"],
  id: "GD03-043",
  externalId: "gundam:gd03-043",
  slug: "messer-type-f02-gd03-043",
  displayName: "Messer Type-F02",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-043",
  printings: [
    {
      id: "GD03-043",
      collectorNumber: "GD03-043",
      cardNumber: "GD03-043",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-043.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-043.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-043",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-043.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-043.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 3,
  hp: 2,
  linkCondition: "(Mafty) Trait",
  effect: "【When Paired】Choose 1 enemy Unit. Deal 1 damage to it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【When Paired】Choose 1 enemy Unit. Deal 1 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
