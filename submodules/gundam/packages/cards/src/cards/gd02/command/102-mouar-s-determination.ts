import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd02MouarSDetermination102: CommandCard = {
  cardNumber: "GD02-102",
  name: "Mouar’s Determination",
  type: "command",
  color: "blue",
  traits: ["titans"],
  id: "GD02-102",
  externalId: "gundam:gd02-102",
  slug: "mouar-s-determination-gd02-102",
  displayName: "Mouar’s Determination",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-102",
  printings: [
    {
      id: "GD02-102",
      collectorNumber: "GD02-102",
      cardNumber: "GD02-102",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-102.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-102.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-102",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-102.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-102.webp?260424",
  legality: "legal",
  level: 2,
  cost: 1,
  pilotName: "Mouar Pharaoh",
  apBonus: 1,
  hpBonus: 0,
  effect:
    "【Main】/【Action】Choose 1 friendly (Titans) Unit. It gets AP+2 during this turn.<br>【Pilot】[Mouar Pharaoh]<br>",
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
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "titans",
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Main】/【Action】Choose 1 friendly (Titans) Unit. It gets AP+2 during this turn. 【Pilot】[Mouar Pharaoh]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
