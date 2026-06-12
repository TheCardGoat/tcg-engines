import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03Rouei067: UnitCard = {
  cardNumber: "GD03-067",
  name: "Rouei",
  type: "unit",
  color: "purple",
  traits: ["teiwaz", "tekkadan"],
  id: "GD03-067",
  externalId: "gundam:gd03-067",
  slug: "rouei-gd03-067",
  displayName: "Rouei",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-067",
  printings: [
    {
      id: "GD03-067",
      collectorNumber: "GD03-067",
      cardNumber: "GD03-067",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-067.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-067.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-067",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-067.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-067.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 3,
  hp: 4,
  linkCondition: "(Teiwaz) / (Tekkadan) Trait",
  effect:
    "【Deploy】You may choose 1 of your Units. Deal 1 damage to it. It gets AP+1 during this turn.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
            },
          },
          optional: true,
        },
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 1,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
            },
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【Deploy】You may choose 1 of your Units. Deal 1 damage to it. It gets AP+1 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
