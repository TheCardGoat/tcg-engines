import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05StrikeFreedomGundam002: UnitCard = {
  cardNumber: "GD05-002",
  name: "Strike Freedom Gundam",
  type: "unit",
  color: "blue",
  traits: ["orb"],
  id: "GD05-002",
  canonicalId: "GD05-002",
  externalIds: { bandai: "gundam:gd05-002" },
  slug: "strike-freedom-gundam-gd05-002",
  displayName: "Strike Freedom Gundam",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-002",
  printings: [
    {
      id: "GD05-002",
      artId: "GD05-002",
      setCode: "GD05",
      collectorNumber: "GD05-002",
      cardNumber: "GD05-002",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-002.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-002.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-002_p1",
      artId: "GD05-002_p1",
      setCode: "GD05",
      collectorNumber: "GD05-002_p1",
      cardNumber: "GD05-002",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-002_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-002_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-002_p2",
      artId: "GD05-002_p2",
      setCode: "GD05",
      collectorNumber: "GD05-002_p2",
      cardNumber: "GD05-002",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-002_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-002_p2.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-002", "GD05-002_p1", "GD05-002_p2"],
  selectedPrintingId: "GD05-002",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-002.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-002.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam SEED Destiny",
  level: 8,
  cost: 6,
  ap: 5,
  hp: 6,
  linkCondition: "[Kira Yamato]",
  battlefieldZones: ["space", "earth"],
  effect:
    "【Deploy】 Choose 1 to 2 of your Units. During this turn, when they destroy an enemy card with battle damage, draw 1.\n【During Pair】【Attack】You may discard 2. If you do, choose 1 enemy Unit with the lowest Lv. Return it to the bottom of its owner's deck.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "createDelayedTrigger",
            duration: "thisTurn",
            eventType: "attackerDestroyedDefender",
            additionalEventTypes: ["shieldAreaCardDestroyedByBattle"],
            eventDamageType: "battle",
            oncePerSimultaneousGroup: true,
            eventCardFilter: {
              owner: "friendly",
              cardType: "unit",
            },
            eventSourceFilter: {
              owner: "friendly",
              cardType: "unit",
              count: { min: 1, max: 2 },
            },
            effect: {
              type: "triggered",
              activation: {},
              directives: [{ action: { action: "draw", count: 1 } }],
              sourceText: "When the chosen Unit destroys an enemy card with battle damage, draw 1.",
            },
          },
        },
      ],
      sourceText:
        "【Deploy】 Choose 1 to 2 of your Units. During this turn, when they destroy an enemy card with battle damage, draw 1.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [
          {
            type: "duringPair",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "resolveThenQueue",
            first: { action: "discard", count: 2 },
            followUp: {
              type: "triggered",
              activation: { timing: [] },
              directives: [
                {
                  action: {
                    action: "returnToDeck",
                    position: "bottom",
                    target: { owner: "opponent", cardType: "unit", count: 1, lowest: "level" },
                  },
                },
              ],
              sourceText:
                "If you do, choose 1 enemy Unit with the lowest Lv. Return it to the bottom of its owner's deck.",
            },
          },
          optional: true,
        },
      ],
      sourceText:
        "【During Pair】【Attack】You may discard 2. If you do, choose 1 enemy Unit with the lowest Lv. Return it to the bottom of its owner's deck.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
