import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02HamanKarnSGazaC039: UnitCard = {
  cardNumber: "GD02-039",
  name: "Haman Karn's Gaza C",
  type: "unit",
  color: "red",
  traits: ["neo zeon"],
  id: "GD02-039",
  externalId: "gundam:gd02-039",
  slug: "haman-karn-s-gaza-c-gd02-039",
  displayName: "Haman Karn's Gaza C",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-039",
  printings: [
    {
      id: "GD02-039",
      collectorNumber: "GD02-039",
      cardNumber: "GD02-039",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-039.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-039.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-039_p1",
      collectorNumber: "GD02-039_p1",
      cardNumber: "GD02-039",
      set: {
        code: "GD02",
        name: "Store Tournament Participant Pack 04",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-039_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-039_p1.webp?260424",
      productName: "Store Tournament Participant Pack 04",
    },
    {
      id: "GD02-039_p2",
      collectorNumber: "GD02-039_p2",
      cardNumber: "GD02-039",
      set: {
        code: "GD02",
        name: "Store Tournament Winner Pack 04",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-039_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-039_p2.webp?260424",
      productName: "Store Tournament Winner Pack 04",
    },
  ],
  selectedPrintingId: "GD02-039",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-039.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-039.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 2,
  hp: 3,
  effect: "【When Paired】Choose 1 enemy Unit that is Lv.3 or lower. Deal 1 damage to it.<br>",
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
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 3,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText: "【When Paired】Choose 1 enemy Unit that is Lv.3 or lower. Deal 1 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
