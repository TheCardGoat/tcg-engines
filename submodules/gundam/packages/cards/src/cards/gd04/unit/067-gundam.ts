import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04Gundam067: UnitCard = {
  cardNumber: "GD04-067",
  name: "∀ Gundam",
  type: "unit",
  color: "white",
  traits: ["militia"],
  id: "GD04-067",
  externalId: "gundam:gd04-067",
  slug: "gundam-gd04-067",
  displayName: "∀ Gundam",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-067",
  printings: [
    {
      id: "GD04-067",
      collectorNumber: "GD04-067",
      cardNumber: "GD04-067",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-067.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-067.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-067_p1",
      collectorNumber: "GD04-067_p1",
      cardNumber: "GD04-067",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-067_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-067_p1.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-067",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-067.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-067.webp?260424",
  legality: "legal",
  level: 5,
  cost: 3,
  ap: 4,
  hp: 4,
  linkCondition: "[Loran Cehack]",
  effect:
    "【Activate･Main】【Once per Turn】①：Choose 1 Unit card with <Repair>/<Breach>/<First Strike>/<Support>/<High-Maneuver>/<Suppression>/<Blocker> from your trash. During this turn, this Unit gets AP+1 and all <Repair>/<Breach>/<First Strike>/<Support>/<High-Maneuver>/<Suppression>/<Blocker> on that Unit card.",
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
      cost: {
        payResources: 1,
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 1,
            duration: "thisTurn",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
        {
          action: {
            action: "copyKeywordEffects",
            duration: "thisTurn",
            source: {
              owner: "any",
              cardType: "unit",
              zone: "trash",
            },
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "【Activate·Main】【Once per Turn】①：Choose 1 Unit card with <Repair>/<Breach>/<First Strike>/<Support>/<High-Maneuver>/<Suppression>/<Blocker> from your trash. During this turn, this Unit gets AP+1 and all <Repair>/<Breach>/<First Strike>/<Support>/<High-Maneuver>/<Suppression>/<Blocker> on that Unit card.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
