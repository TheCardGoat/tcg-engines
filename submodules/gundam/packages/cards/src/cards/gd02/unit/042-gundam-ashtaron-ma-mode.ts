import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02GundamAshtaronMaMode042: UnitCard = {
  cardNumber: "GD02-042",
  name: "Gundam Ashtaron (MA Mode)",
  type: "unit",
  color: "red",
  traits: ["new une"],
  id: "GD02-042",
  externalId: "gundam:gd02-042",
  slug: "gundam-ashtaron-ma-mode-gd02-042",
  displayName: "Gundam Ashtaron (MA Mode)",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-042",
  printings: [
    {
      id: "GD02-042",
      collectorNumber: "GD02-042",
      cardNumber: "GD02-042",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-042.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-042.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-042",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-042.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-042.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 3,
  hp: 2,
  effect:
    "【Deploy】Choose 1 of your (New UNE) Units. It gains &lt;High-Maneuver&gt; during this turn.<br>\n(This Unit can't be blocked.)<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "HighManeuver",
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "new une",
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Deploy】Choose 1 of your (New UNE) Units. It gains <High-Maneuver> during this turn. (This Unit can't be blocked.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
