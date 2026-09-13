import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05GyuneiSJagdDoga057: UnitCard = {
  cardNumber: "GD05-057",
  name: "Gyunei's Jagd Doga",
  type: "unit",
  color: "purple",
  traits: ["neo zeon"],
  id: "GD05-057",
  canonicalId: "GD05-057",
  externalIds: { bandai: "gundam:gd05-057" },
  slug: "gyunei-s-jagd-doga-gd05-057",
  displayName: "Gyunei's Jagd Doga",
  rulesText:
    "【Activate･Main】【Once per Turn】Choose 1 of your other Units. Destroy it. If you do, set this Unit as active. It can't choose the enemy player as its attack target during this turn.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-057",
  printings: [
    {
      id: "GD05-057",
      artId: "GD05-057",
      setCode: "GD05",
      collectorNumber: "GD05-057",
      cardNumber: "GD05-057",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-057.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-057",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-057.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam: Char's Counterattack",
  level: 4,
  cost: 3,
  ap: 4,
  hp: 3,
  linkCondition: "[Gyunei Guss]",
  battlefieldZones: ["space", "earth"],
  effect:
    "【Activate･Main】【Once per Turn】Choose 1 of your other Units. Destroy it. If you do, set this Unit as active. It can't choose the enemy player as its attack target during this turn.",
  effects: [
    {
      type: "activated",
      activation: {
        timing: ["activate:main"],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "destroy",
            target: {
              owner: "friendly",
              cardType: "unit",
              excludeSource: true,
              count: 1,
            },
          },
        },
        {
          action: {
            action: "setActive",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
          dependsOnPrevious: true,
        },
        {
          action: {
            action: "cantTargetPlayer",
            whose: "opponent",
          },
        },
      ],
      sourceText:
        "【Activate·Main】【Once per Turn】Choose 1 of your other Units. Destroy it. If you do, set this Unit as active. It can't choose the enemy player as its attack target during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
