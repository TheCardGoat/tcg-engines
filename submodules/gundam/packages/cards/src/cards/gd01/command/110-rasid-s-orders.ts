import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd01RasidSOrders110: CommandCard = {
  cardNumber: "GD01-110",
  name: "Rasid's Orders",
  type: "command",
  color: "green",
  traits: ["maganac corps"],
  id: "GD01-110",
  externalId: "gundam:gd01-110",
  slug: "rasid-s-orders-gd01-110",
  displayName: "Rasid's Orders",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-110",
  printings: [
    {
      id: "GD01-110",
      collectorNumber: "GD01-110",
      cardNumber: "GD01-110",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-110.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-110.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-110",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-110.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-110.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  pilotName: "Rasid Kurama",
  apBonus: 0,
  hpBonus: 1,
  effect:
    "【Main】/【Action】Choose 1 Unit that is Lv.4 or higher. During this turn, it may choose an active enemy Unit with 6 or less AP as its attack target.<br>【Pilot】[Rasid Kurama]<br>",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          action: {
            action: "chooseAttackTarget",
            unit: {
              owner: "friendly",
              count: 1,
            },
            attackTarget: {
              owner: "opponent",
              cardType: "unit",
              state: "active",
              attributeFilters: [
                {
                  attribute: "ap",
                  comparison: "lte",
                  value: 6,
                },
              ],
            },
            duration: "thisTurn",
          },
        },
      ],
      sourceText:
        "【Main】/【Action】Choose 1 Unit that is Lv.4 or higher. During this turn, it may choose an active enemy Unit with 6 or less AP as its attack target. 【Pilot】[Rasid Kurama]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
