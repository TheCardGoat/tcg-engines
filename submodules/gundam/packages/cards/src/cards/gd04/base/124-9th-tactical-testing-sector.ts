import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd049thTacticalTestingSector124: BaseCard = {
  cardNumber: "GD04-124",
  name: "9th Tactical Testing Sector",
  type: "base",
  color: "green",
  traits: ["academy", "stronghold"],
  id: "GD04-124",
  canonicalId: "GD04-124",
  externalIds: { bandai: "gundam:gd04-124" },
  slug: "9th-tactical-testing-sector/gd04-124",
  displayName: "9th Tactical Testing Sector",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-124",
  printings: [
    {
      id: "GD04-124",
      artId: "GD04-124",
      setCode: "GD04",
      collectorNumber: "GD04-124",
      cardNumber: "GD04-124",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd04/GD04-124.webp",
      productName: "Phantom Aria [GD04]",
    },
  ],
  reprints: ["GD04-124"],
  selectedPrintingId: "GD04-124",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd04/GD04-124.webp",
  legality: "legal",
  level: 3,
  cost: 1,
  hp: 5,
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\r\nWhen you place an EX Resource, choose 1 friendly (Academy) Unit. It gets AP+2 during this turn.",
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
        timing: ["onExResourcePlaced"],
        conditions: [{ type: "eventPlayerIsSelf" }],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 2,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "academy",
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "When you place an EX Resource, choose 1 friendly (Academy) Unit. It gets AP+2 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
