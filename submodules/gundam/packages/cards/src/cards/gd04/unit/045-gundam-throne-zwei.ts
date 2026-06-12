import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04GundamThroneZwei045: UnitCard = {
  cardNumber: "GD04-045",
  name: "Gundam Throne Zwei",
  type: "unit",
  color: "red",
  traits: ["cb", "trinity"],
  id: "GD04-045",
  externalId: "gundam:gd04-045",
  slug: "gundam-throne-zwei-gd04-045",
  displayName: "Gundam Throne Zwei",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-045",
  printings: [
    {
      id: "GD04-045",
      collectorNumber: "GD04-045",
      cardNumber: "GD04-045",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-045.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-045.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-045",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-045.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-045.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 3,
  hp: 4,
  linkCondition: "(Trinity) Trait / [Ali al-Saachez]",
  effect:
    "【When Linked】Choose 1 of your (CB) Units. During this turn, it may choose a damaged active enemy Unit as its attack target.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenLinked"],
      },
      directives: [
        {
          action: {
            action: "chooseAttackTarget",
            unit: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "cb" }],
            },
            attackTarget: {
              owner: "opponent",
              cardType: "unit",
              state: ["damaged", "active"],
            },
            duration: "thisTurn",
          },
        },
      ],
      sourceText:
        "【When Linked】Choose 1 of your (CB) Units. During this turn, it may choose a damaged active enemy Unit as its attack target.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
