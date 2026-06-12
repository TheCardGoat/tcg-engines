import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04Gundam073: UnitCard = {
  cardNumber: "GD04-073",
  name: "∀ Gundam",
  type: "unit",
  color: "white",
  traits: ["militia"],
  id: "GD04-073",
  externalId: "gundam:gd04-073",
  slug: "gundam-gd04-073",
  displayName: "∀ Gundam",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-073",
  printings: [
    {
      id: "GD04-073",
      collectorNumber: "GD04-073",
      cardNumber: "GD04-073",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-073.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-073.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-073",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-073.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-073.webp?260424",
  legality: "legal",
  level: 4,
  cost: 2,
  ap: 3,
  hp: 3,
  linkCondition: "(Militia) Trait / (Moonrace) Trait",
  effect: "【Activate･Main】【Once per Turn】①：This Unit gets AP+2 during this turn.",
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
            amount: 2,
            duration: "thisTurn",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText: "【Activate·Main】【Once per Turn】①：This Unit gets AP+2 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
