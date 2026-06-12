import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd04Backup115: CommandCard = {
  cardNumber: "GD04-115",
  name: "Backup",
  type: "command",
  color: "purple",
  traits: [],
  id: "GD04-115",
  externalId: "gundam:gd04-115",
  slug: "backup-gd04-115",
  displayName: "Backup",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-115",
  printings: [
    {
      id: "GD04-115",
      collectorNumber: "GD04-115",
      cardNumber: "GD04-115",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-115.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-115.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-115",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-115.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-115.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  effect:
    "【Burst】Choose 1 enemy Unit. Deal 1 damage to it.\n【Main】Choose 1 of your Units. When it deals battle damage to an enemy Unit that is Lv.5 or lower during this turn, destroy that enemy Unit.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Burst】Choose 1 enemy Unit. Deal 1 damage to it.",
    },
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "createDelayedTrigger",
            duration: "thisTurn",
            eventType: "battleDamageDealtToUnit",
            eventSourceFilter: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
            },
            eventCardFilter: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [{ attribute: "level", comparison: "lte", value: 5 }],
            },
            effect: {
              type: "triggered",
              activation: { timing: ["onBattleDamageDealtToUnit"] },
              directives: [{ action: { action: "destroyEventCard" } }],
              sourceText:
                "When it deals battle damage to an enemy Unit that is Lv.5 or lower during this turn, destroy that enemy Unit.",
            },
          },
        },
      ],
      sourceText:
        "【Main】Choose 1 of your Units. When it deals battle damage to an enemy Unit that is Lv.5 or lower during this turn, destroy that enemy Unit.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
