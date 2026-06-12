import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd04EnnilEl096: PilotCard = {
  cardNumber: "GD04-096",
  name: "Ennil El",
  type: "pilot",
  color: "purple",
  traits: ["vulture"],
  id: "GD04-096",
  externalId: "gundam:gd04-096",
  slug: "ennil-el-gd04-096",
  displayName: "Ennil El",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-096",
  printings: [
    {
      id: "GD04-096",
      collectorNumber: "GD04-096",
      cardNumber: "GD04-096",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-096.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-096.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-096",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-096.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-096.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 1,
  hpBonus: 2,
  effect:
    "【Burst】Add this card to your hand.\n【During Link】When this Unit deals battle damage to an enemy Unit that is Lv.5 or lower, destroy that enemy Unit.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "addSelfToHand",
          },
        },
      ],
      sourceText: "【Burst】Add this card to your hand.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["onBattleDamageReceived"],
        conditions: [
          { type: "duringLink" },
          { type: "eventSourceIsSelf" },
          {
            type: "eventCardMatches",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [{ attribute: "level", comparison: "lte", value: 5 }],
            },
          },
        ],
      },
      directives: [{ action: { action: "destroyEventCard" } }],
      sourceText:
        "【During Link】When this Unit deals battle damage to an enemy Unit that is Lv.5 or lower, destroy that enemy Unit.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
