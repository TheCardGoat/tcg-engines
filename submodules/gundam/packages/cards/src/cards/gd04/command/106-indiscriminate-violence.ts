import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd04IndiscriminateViolence106: CommandCard = {
  cardNumber: "GD04-106",
  name: "Indiscriminate Violence",
  type: "command",
  color: "green",
  traits: ["academy", "dawn of fold"],
  id: "GD04-106",
  externalId: "gundam:gd04-106",
  slug: "indiscriminate-violence-gd04-106",
  displayName: "Indiscriminate Violence",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-106",
  printings: [
    {
      id: "GD04-106",
      collectorNumber: "GD04-106",
      cardNumber: "GD04-106",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-106.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-106.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-106",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-106.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-106.webp?260424",
  legality: "legal",
  level: 5,
  cost: 1,
  pilotName: "Norea Du Noc",
  apBonus: 2,
  hpBonus: 0,
  effect:
    "【Main】Choose 1 friendly (Academy) Unit. During this turn, it may choose an active enemy Unit with 5 or less AP as its attack target. If you use an EX Resource to play this card, choose 1 to 2 friendly (Academy) Units instead.\n【Pilot】[Norea Du Noc]",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "chooseAttackTarget",
            unit: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "academy" }],
              count: 1,
            },
            exResourceUnitCount: { min: 1, max: 2 },
            attackTarget: {
              owner: "opponent",
              cardType: "unit",
              state: "active",
              attributeFilters: [
                {
                  attribute: "ap",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
            duration: "thisTurn",
          },
        },
      ],
      sourceText:
        "【Main】Choose 1 friendly (Academy) Unit. During this turn, it may choose an active enemy Unit with 5 or less AP as its attack target. If you use an EX Resource to play this card, choose 1 to 2 friendly (Academy) Units instead. 【Pilot】[Norea Du Noc]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
