import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd05Axis129: BaseCard = {
  cardNumber: "GD05-129",
  name: "Axis",
  type: "base",
  color: "purple",
  traits: ["neo zeon", "stronghold"],
  id: "GD05-129",
  canonicalId: "GD05-129",
  externalIds: { bandai: "gundam:gd05-129" },
  slug: "axis-gd05-129",
  displayName: "Axis",
  rulesText:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\n【Activate･Main】Rest this Base：If one of your Units has been destroyed by one of your (Neo Zeon) card's effects during this turn, deploy 1 (Neo Zeon) Unit card that is Lv.3 or lower from your hand.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-129",
  printings: [
    {
      id: "GD05-129",
      artId: "GD05-129",
      setCode: "GD05",
      collectorNumber: "GD05-129",
      cardNumber: "GD05-129",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-129.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-129",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-129.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam: Char's Counterattack",
  level: 4,
  cost: 1,
  hp: 6,
  battlefieldZones: ["space"],
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\n【Activate･Main】Rest this Base：If one of your Units has been destroyed by one of your (Neo Zeon) card's effects during this turn, deploy 1 (Neo Zeon) Unit card that is Lv.3 or lower from your hand.",
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
      type: "activated",
      activation: {
        timing: ["activate:main"],
        conditions: [
          {
            type: "friendlyUnitDestroyedByFriendlyTraitThisTurn",
            trait: "neo zeon",
          },
        ],
      },
      cost: {
        restSelf: true,
      },
      directives: [
        {
          action: {
            action: "deploy",
            target: {
              owner: "friendly",
              zone: "hand",
              count: 1,
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "neo zeon",
                },
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "【Activate·Main】Rest this Base：If one of your Units has been destroyed by one of your (Neo Zeon) card's effects during this turn, deploy 1 (Neo Zeon) Unit card that is Lv.3 or lower from your hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
