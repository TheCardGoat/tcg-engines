import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd02PersistentAndFortudinous119: CommandCard = {
  cardNumber: "GD02-119",
  name: "Persistent and Fortudinous",
  type: "command",
  color: "white",
  traits: ["gjallarhorn"],
  id: "GD02-119",
  externalId: "gundam:gd02-119",
  slug: "persistent-and-fortudinous-gd02-119",
  displayName: "Persistent and Fortudinous",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-119",
  printings: [
    {
      id: "GD02-119",
      collectorNumber: "GD02-119",
      cardNumber: "GD02-119",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-119.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-119.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-119",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-119.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-119.webp?260424",
  legality: "legal",
  level: 2,
  cost: 1,
  pilotName: "Carta Issue",
  apBonus: 1,
  hpBonus: 0,
  effect:
    "【Action】If you have a (Gjallarhorn) Link Unit in play, choose 1 enemy Unit. It gets AP-3 during this battle.<br>【Pilot】[Carta Issue]<br>",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["action"],
        conditions: [
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            hasTrait: "gjallarhorn",
            isLinkUnit: true,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: -3,
            duration: "thisBattle",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Action】If you have a (Gjallarhorn) Link Unit in play, choose 1 enemy Unit. It gets AP-3 during this battle. 【Pilot】[Carta Issue]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
