import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd02ItSNameIsRyuseiGo114: CommandCard = {
  cardNumber: "GD02-114",
  name: "It's Name is Ryusei-Go",
  type: "command",
  color: "purple",
  traits: ["tekkadan", "alaya-vijnana"],
  id: "GD02-114",
  externalId: "gundam:gd02-114",
  slug: "it-s-name-is-ryusei-go-gd02-114",
  displayName: "It's Name is Ryusei-Go",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-114",
  printings: [
    {
      id: "GD02-114",
      collectorNumber: "GD02-114",
      cardNumber: "GD02-114",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-114.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-114.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-114",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-114.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-114.webp?260424",
  legality: "legal",
  level: 2,
  cost: 1,
  pilotName: "Norba Shino",
  apBonus: 1,
  hpBonus: 0,
  effect:
    "【Main】/【Action】Choose 1 damaged friendly Unit. It gets AP+2 during this turn.<br>【Pilot】[Norba Shino]<br>",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 2,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              state: "damaged",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Main】/【Action】Choose 1 damaged friendly Unit. It gets AP+2 during this turn. 【Pilot】[Norba Shino]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
