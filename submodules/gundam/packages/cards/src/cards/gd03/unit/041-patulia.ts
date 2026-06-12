import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03Patulia041: UnitCard = {
  cardNumber: "GD03-041",
  name: "Patulia",
  type: "unit",
  color: "red",
  traits: ["sra"],
  id: "GD03-041",
  externalId: "gundam:gd03-041",
  slug: "patulia-gd03-041",
  displayName: "Patulia",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-041",
  printings: [
    {
      id: "GD03-041",
      collectorNumber: "GD03-041",
      cardNumber: "GD03-041",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-041.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-041.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-041",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-041.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-041.webp?260424",
  legality: "legal",
  level: 7,
  cost: 6,
  ap: 5,
  hp: 6,
  linkCondition: "[Carris Nautilus]",
  effect: "【Deploy】Deal 3 damage to all Bases.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "dealDamageAll",
            amount: 3,
            target: {
              owner: "any",
              cardType: "base",
            },
          },
        },
      ],
      sourceText: "【Deploy】Deal 3 damage to all Bases.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
