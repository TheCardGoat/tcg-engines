import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02GundamAshtaron040: UnitCard = {
  cardNumber: "GD02-040",
  name: "Gundam Ashtaron",
  type: "unit",
  color: "red",
  traits: ["new une"],
  id: "GD02-040",
  externalId: "gundam:gd02-040",
  slug: "gundam-ashtaron-gd02-040",
  displayName: "Gundam Ashtaron",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-040",
  printings: [
    {
      id: "GD02-040",
      collectorNumber: "GD02-040",
      cardNumber: "GD02-040",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-040.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-040.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-040_p1",
      collectorNumber: "GD02-040_p1",
      cardNumber: "GD02-040",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-040_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-040_p1.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-040",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-040.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-040.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 3,
  hp: 3,
  effect:
    "【Activate･Main】&lt;Support 2&gt; (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)<br>【Deploy】Choose 1 of your other (New UNE) Units. It can't receive battle damage from enemy Units with 2 or less HP during this turn.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "preventDamage",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              excludeSource: true,
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "New UNE" }],
            },
            unitFilter: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [{ attribute: "hp", comparison: "lte", value: 2 }],
            },
          },
        },
      ],
      sourceText:
        "【Deploy】Choose 1 of your other (New UNE) Units. It can't receive battle damage from enemy Units with 2 or less HP during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Support", value: 2 }],
  rarity: "rare",
};
