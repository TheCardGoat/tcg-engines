import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04GundamDynamesGnFullShield029: UnitCard = {
  cardNumber: "GD04-029",
  name: "Gundam Dynames (GN Full Shield)",
  type: "unit",
  color: "green",
  traits: ["cb", "gn drive"],
  id: "GD04-029",
  externalId: "gundam:gd04-029",
  slug: "gundam-dynames-gn-full-shield-gd04-029",
  displayName: "Gundam Dynames (GN Full Shield)",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-029",
  printings: [
    {
      id: "GD04-029",
      collectorNumber: "GD04-029",
      cardNumber: "GD04-029",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-029.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-029.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-029",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-029.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-029.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 2,
  hp: 3,
  linkCondition: "[Lockon Stratos]",
  effect:
    "【Once per Turn】If you have a (CB) Pilot in play, when this Unit receives damage from an enemy, reduce it by 1.",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "battleArea",
            cardType: "pilot",
            hasTrait: "cb",
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
            amount: 1,
            target: { owner: "self", cardType: "unit" },
            source: "enemy",
            duration: "permanent",
          },
        },
      ],
      sourceText:
        "【Once per Turn】If you have a (CB) Pilot in play, when this Unit receives damage from an enemy, reduce it by 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
