import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04GundamKyriosTailBooster023: UnitCard = {
  cardNumber: "GD04-023",
  name: "Gundam Kyrios (Tail Booster)",
  type: "unit",
  color: "green",
  traits: ["cb", "gn drive"],
  id: "GD04-023",
  externalId: "gundam:gd04-023",
  slug: "gundam-kyrios-tail-booster-gd04-023",
  displayName: "Gundam Kyrios (Tail Booster)",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-023",
  printings: [
    {
      id: "GD04-023",
      collectorNumber: "GD04-023",
      cardNumber: "GD04-023",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-023.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-023.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-023",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-023.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-023.webp?260424",
  legality: "legal",
  level: 5,
  cost: 4,
  ap: 5,
  hp: 3,
  linkCondition: "[Allelujah Haptism] / [Hallelujah Haptism]",
  effect:
    "【Deploy】Choose 1 of your Units paired with a (Super Soldier) Pilot. During this turn, it may choose an active enemy Unit that is Lv.4 or lower as its attack target.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "chooseAttackTarget",
            unit: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              attributeFilters: [
                {
                  attribute: "pairedPilotTrait",
                  comparison: "includes",
                  value: "super soldier",
                },
              ],
            },
            attackTarget: {
              owner: "opponent",
              cardType: "unit",
              state: "active",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "【Deploy】Choose 1 of your Units paired with a (Super Soldier) Pilot. During this turn, it may choose an active enemy Unit that is Lv.4 or lower as its attack target.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
