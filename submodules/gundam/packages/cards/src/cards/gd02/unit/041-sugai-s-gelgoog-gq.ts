import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02SugaiSGelgoogGq041: UnitCard = {
  cardNumber: "GD02-041",
  name: "Sugai's Gelgoog (GQ)",
  type: "unit",
  color: "red",
  traits: ["clan"],
  id: "GD02-041",
  externalId: "gundam:gd02-041",
  slug: "sugai-s-gelgoog-gq-gd02-041",
  displayName: "Sugai's Gelgoog (GQ)",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-041",
  printings: [
    {
      id: "GD02-041",
      collectorNumber: "GD02-041",
      cardNumber: "GD02-041",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-041.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-041.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-041_p1",
      collectorNumber: "GD02-041_p1",
      cardNumber: "GD02-041",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-041_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-041_p1.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-041",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-041.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-041.webp?260424",
  legality: "legal",
  level: 4,
  cost: 4,
  ap: 3,
  hp: 3,
  effect: "【Deploy】Choose 1 enemy Unit that is Lv.5 or higher. Deal 2 damage to it.<br>",
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
            amount: 2,
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "gte",
                  value: 5,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Deploy】Choose 1 enemy Unit that is Lv.5 or higher. Deal 2 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
