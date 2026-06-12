import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04UnicornGundam02BansheeNornDestroyMode065: UnitCard = {
  cardNumber: "GD04-065",
  name: "Unicorn Gundam 02 Banshee Norn (Destroy Mode)",
  type: "unit",
  color: "white",
  traits: ["earth federation"],
  id: "GD04-065",
  externalId: "gundam:gd04-065",
  slug: "unicorn-gundam-02-banshee-norn-destroy-mode-gd04-065",
  displayName: "Unicorn Gundam 02 Banshee Norn (Destroy Mode)",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-065",
  printings: [
    {
      id: "GD04-065",
      collectorNumber: "GD04-065",
      cardNumber: "GD04-065",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-065.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-065.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-065_p1",
      collectorNumber: "GD04-065_p1",
      cardNumber: "GD04-065",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-065_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-065_p1.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-065",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-065.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-065.webp?260424",
  legality: "legal",
  level: 7,
  cost: 5,
  ap: 5,
  hp: 5,
  linkCondition: "[Riddhe Marcenas]",
  effect:
    "【During Link】【Activate･Main】Exile 3 blue cards from your trash：Set this Unit as active. It can't choose the enemy player as its attack target during this turn.\n【Attack】All enemy Units get AP-1 during this turn.",
  effects: [
    {
      type: "activated",
      activation: {
        timing: ["activate:main"],
        conditions: [{ type: "duringLink" }],
      },
      directives: [
        {
          action: {
            action: "setActive",
            target: {
              owner: "friendly",
              cardType: "unit",
              state: "active",
            },
          },
        },
        {
          action: {
            action: "cantTargetPlayer",
            whose: "opponent",
          },
        },
      ],
      sourceText:
        "【During Link】【Activate·Main】Exile 3 blue cards from your trash：Set this Unit as active. It can't choose the enemy player as its attack target during this turn.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: -1,
            duration: "thisTurn",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: "all",
            },
          },
        },
      ],
      sourceText: "【Attack】All enemy Units get AP-1 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
