import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd02ComradesComeFirst116: CommandCard = {
  cardNumber: "GD02-116",
  name: "Comrades Come First",
  type: "command",
  color: "purple",
  traits: ["vulture"],
  id: "GD02-116",
  externalId: "gundam:gd02-116",
  slug: "comrades-come-first-gd02-116",
  displayName: "Comrades Come First",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-116",
  printings: [
    {
      id: "GD02-116",
      collectorNumber: "GD02-116",
      cardNumber: "GD02-116",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-116.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-116.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-116",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-116.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-116.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  pilotName: "Roybea Loy",
  apBonus: 1,
  hpBonus: 0,
  effect:
    "【Main】If there are 7 or more cards in your trash, choose 1 friendly (Vulture) Unit. During this turn, it may choose an active enemy Unit that is Lv.4 or lower as its attack target.<br>【Pilot】[Roybea Loy]<br>",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main"],
        conditions: [
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            comparison: "gte",
            count: 7,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "chooseAttackTarget",
            unit: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "vulture" }],
            },
            attackTarget: {
              owner: "opponent",
              cardType: "unit",
              state: "active",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
            duration: "thisTurn",
          },
        },
      ],
      sourceText:
        "【Main】If there are 7 or more cards in your trash, choose 1 friendly (Vulture) Unit. During this turn, it may choose an active enemy Unit that is Lv.4 or lower as its attack target. 【Pilot】[Roybea Loy]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
