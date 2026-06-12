import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd04IzumaColony126: BaseCard = {
  cardNumber: "GD04-126",
  name: "Izuma Colony",
  type: "base",
  traits: ["clan", "stronghold"],
  id: "GD04-126",
  externalId: "gundam:gd04-126",
  slug: "izuma-colony-gd04-126",
  displayName: "Izuma Colony",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-126",
  printings: [
    {
      id: "GD04-126",
      collectorNumber: "GD04-126",
      cardNumber: "GD04-126",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-126.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-126.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-126",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-126.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-126.webp?260424",
  legality: "legal",
  level: 1,
  cost: 1,
  hp: 4,
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\r\nWhen this Base receives battle damage from an enemy Unit with 3 or less AP, deal 1 damage to that Unit.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "deploySelf",
          },
        },
      ],
      sourceText: "【Burst】Deploy this card.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "addShieldToHand",
            count: 1,
          },
        },
      ],
      sourceText: "【Deploy】Add 1 of your Shields to your hand.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["onBattleDamageReceived"],
        conditions: [{ type: "eventCardIsSelf" }],
      },
      directives: [
        {
          action: {
            action: "dealDamageEventSource",
            amount: 1,
            sourceFilter: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "ap",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "When this Base receives battle damage from an enemy Unit with 3 or less AP, deal 1 damage to that Unit.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
