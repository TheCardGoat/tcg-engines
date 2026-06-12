import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd02SisterlyCare113: CommandCard = {
  cardNumber: "GD02-113",
  name: "Sisterly Care",
  type: "command",
  color: "purple",
  traits: ["teiwaz"],
  id: "GD02-113",
  externalId: "gundam:gd02-113",
  slug: "sisterly-care-gd02-113",
  displayName: "Sisterly Care",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-113",
  printings: [
    {
      id: "GD02-113",
      collectorNumber: "GD02-113",
      cardNumber: "GD02-113",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-113.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-113.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-113",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-113.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-113.webp?260424",
  legality: "legal",
  level: 4,
  cost: 2,
  pilotName: "Amida Arca",
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Main】/【Action】If a friendly (Teiwaz) Link Unit is in play, choose 1 enemy Unit with 2 or less AP. Destroy it.<br>【Pilot】[Amida Arca]<br>",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
        conditions: [
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            hasTrait: "teiwaz",
            isLinkUnit: true,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "destroy",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              attributeFilters: [{ attribute: "ap", comparison: "lte", value: 2 }],
            },
          },
        },
      ],
      sourceText:
        "【Main】/【Action】If a friendly (Teiwaz) Link Unit is in play, choose 1 enemy Unit with 2 or less AP. Destroy it. 【Pilot】[Amida Arca]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
