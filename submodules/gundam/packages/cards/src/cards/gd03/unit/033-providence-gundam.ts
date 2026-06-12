import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03ProvidenceGundam033: UnitCard = {
  cardNumber: "GD03-033",
  name: "Providence Gundam",
  type: "unit",
  color: "red",
  traits: ["zaft"],
  id: "GD03-033",
  externalId: "gundam:gd03-033",
  slug: "providence-gundam-gd03-033",
  displayName: "Providence Gundam",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-033",
  printings: [
    {
      id: "GD03-033",
      collectorNumber: "GD03-033",
      cardNumber: "GD03-033",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-033.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-033.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-033_p1",
      collectorNumber: "GD03-033_p1",
      cardNumber: "GD03-033",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-033_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-033_p1.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-033",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-033.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-033.webp?260424",
  legality: "legal",
  level: 7,
  cost: 5,
  ap: 5,
  hp: 5,
  linkCondition: "[Rau Le Creuset]",
  effect:
    "【During Pair･(ZAFT) Pilot】During your turn, all your (ZAFT) Units get AP+2.\n【Attack】Choose 1 enemy Unit. Deal 1 damage to it for each 4 AP this Unit has.",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          { type: "duringPair" },
          {
            type: "isTurn",
            whose: "friendly",
          },
        ],
        qualification: {
          attribute: "trait",
          comparison: "includes",
          value: "zaft",
        },
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 2,
            duration: "permanent",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "zaft",
                },
              ],
            },
          },
        },
      ],
      sourceText: "【During Pair·(ZAFT) Pilot】During your turn, all your (ZAFT) Units get AP+2.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
      },
      directives: [
        {
          action: {
            action: "dealDamageBySourceStat",
            stat: "ap",
            divisor: 4,
            damagePerStep: 1,
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Attack】Choose 1 enemy Unit. Deal 1 damage to it for each 4 AP this Unit has.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
