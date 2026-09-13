import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05GundamAge2DoubleBullet021: UnitCard = {
  cardNumber: "GD05-021",
  name: "Gundam AGE-2 Double Bullet",
  type: "unit",
  color: "green",
  traits: ["earth federation", "age system"],
  id: "GD05-021",
  canonicalId: "GD05-021",
  externalIds: { bandai: "gundam:gd05-021" },
  slug: "gundam-age-2-double-bullet-gd05-021",
  displayName: "Gundam AGE-2 Double Bullet",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-021",
  printings: [
    {
      id: "GD05-021",
      artId: "GD05-021",
      setCode: "GD05",
      collectorNumber: "GD05-021",
      cardNumber: "GD05-021",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-021.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-021.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-021_p1",
      artId: "GD05-021_p1",
      setCode: "GD05",
      collectorNumber: "GD05-021_p1",
      cardNumber: "GD05-021",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-021_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-021_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-021", "GD05-021_p1"],
  selectedPrintingId: "GD05-021",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-021.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-021.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam AGE",
  level: 6,
  cost: 5,
  ap: 4,
  hp: 5,
  linkCondition: "[Asemu Asuno]",
  battlefieldZones: ["space", "earth"],
  effect:
    "【Activate･Action】【Once per Turn】①：This Unit gets AP+4 during this battle.\n【Once per Turn】When this Unit receives enemy damage, if you have an (Earth Federation) Pilot in play, reduce it by 2.",
  effects: [
    {
      type: "activated",
      activation: {
        timing: ["activate:action"],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
      },
      cost: {
        payResources: 1,
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 4,
            duration: "thisBattle",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText: "【Activate·Action】【Once per Turn】①：This Unit gets AP+4 during this battle.",
    },
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "battleArea",
            cardType: "pilot",
            hasTrait: "earth federation",
            comparison: "gte",
            count: 1,
          },
        ],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "reduceNextDamage",
            amount: 2,
            target: {
              owner: "self",
              cardType: "unit",
            },
            source: "enemy",
            duration: "permanent",
          },
        },
      ],
      sourceText:
        "【Once per Turn】When this Unit receives enemy damage, if you have an (Earth Federation) Pilot in play, reduce it by 2.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
