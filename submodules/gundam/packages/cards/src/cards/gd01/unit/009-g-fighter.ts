import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01GFighter009: UnitCard = {
  cardNumber: "GD01-009",
  name: "G-Fighter",
  type: "unit",
  color: "blue",
  traits: ["earth federation", "white base team"],
  id: "GD01-009",
  externalId: "gundam:gd01-009",
  slug: "g-fighter-gd01-009",
  displayName: "G-Fighter",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-009",
  printings: [
    {
      id: "GD01-009",
      collectorNumber: "GD01-009",
      cardNumber: "GD01-009",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-009.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-009.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-009_p1",
      collectorNumber: "GD01-009_p1",
      cardNumber: "GD01-009",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "uncommon",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/GD01-009_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-009_p1.webp?260424",
      productName: "Edition Beta",
    },
  ],
  selectedPrintingId: "GD01-009",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-009.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-009.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 3,
  hp: 2,
  effect:
    "【Deploy】Choose 1 of your (white Base Team) Units. It gains &lt;High-Maneuver&gt; during this turn.<br>\n (This Unit can't be blocked.)<br>",
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
                  value: "white base team",
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Deploy】Choose 1 of your (white Base Team) Units. It gains <High-Maneuver> during this turn. (This Unit can't be blocked.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
