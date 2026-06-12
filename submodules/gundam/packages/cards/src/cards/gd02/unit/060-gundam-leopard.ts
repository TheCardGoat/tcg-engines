import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02GundamLeopard060: UnitCard = {
  cardNumber: "GD02-060",
  name: "Gundam Leopard",
  type: "unit",
  color: "purple",
  traits: ["vulture"],
  id: "GD02-060",
  externalId: "gundam:gd02-060",
  slug: "gundam-leopard-gd02-060",
  displayName: "Gundam Leopard",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-060",
  printings: [
    {
      id: "GD02-060",
      collectorNumber: "GD02-060",
      cardNumber: "GD02-060",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-060.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-060.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-060_p1",
      collectorNumber: "GD02-060_p1",
      cardNumber: "GD02-060",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "uncommon",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-060_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-060_p1.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-060",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-060.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-060.webp?260424",
  legality: "legal",
  level: 5,
  cost: 4,
  ap: 4,
  hp: 4,
  effect:
    "【Deploy】If there are 7 or more cards in your trash, choose 1 enemy Unit that is Lv.4 or lower. Rest it.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
        conditions: [
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            comparison: "gte",
            count: 7,
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
              attributeFilters: [{ attribute: "level", comparison: "lte", value: 4 }],
            },
          },
        },
      ],
      sourceText:
        "【Deploy】If there are 7 or more cards in your trash, choose 1 enemy Unit that is Lv.4 or lower. Rest it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
