import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02GundamEpyon002: UnitCard = {
  cardNumber: "GD02-002",
  name: "Gundam Epyon",
  type: "unit",
  color: "blue",
  traits: ["white fang"],
  id: "GD02-002",
  externalId: "gundam:gd02-002",
  slug: "gundam-epyon-gd02-002",
  displayName: "Gundam Epyon",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-002",
  printings: [
    {
      id: "GD02-002",
      collectorNumber: "GD02-002",
      cardNumber: "GD02-002",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-002.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-002.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-002_p1",
      collectorNumber: "GD02-002_p1",
      cardNumber: "GD02-002",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-002_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-002_p1.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-002",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-002.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-002.webp?260424",
  legality: "legal",
  level: 8,
  cost: 7,
  ap: 6,
  hp: 6,
  linkCondition: "[Zechs Merquise]",
  effect:
    "【During Link】【Once per Turn】During your turn, when one of your Units destroys an enemy Unit with battle damage, set this Unit as active.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["onDestroyByBattle"],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
        conditions: [{ type: "duringLink" }, { type: "isTurn", whose: "friendly" }],
      },
      directives: [
        {
          action: {
            action: "setActive",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "【During Link】【Once per Turn】During your turn, when one of your Units destroys an enemy Unit with battle damage, set this Unit as active.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
