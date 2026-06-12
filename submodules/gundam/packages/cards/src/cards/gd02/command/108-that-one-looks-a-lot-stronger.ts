import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd02ThatOneLooksALotStronger108: CommandCard = {
  cardNumber: "GD02-108",
  name: "That One Looks A Lot Stronger?",
  type: "command",
  color: "red",
  traits: ["-"],
  id: "GD02-108",
  externalId: "gundam:gd02-108",
  slug: "that-one-looks-a-lot-stronger-gd02-108",
  displayName: "That One Looks A Lot Stronger?",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-108",
  printings: [
    {
      id: "GD02-108",
      collectorNumber: "GD02-108",
      cardNumber: "GD02-108",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-108.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-108.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-108",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-108.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-108.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  effect:
    "【Main】Choose 1 friendly (Clan) Unit. During this turn, it may choose an active enemy Unit that is Lv.4 or lower as its attack target.<br>",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "chooseAttackTarget",
            unit: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "clan" }],
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
        "【Main】Choose 1 friendly (Clan) Unit. During this turn, it may choose an active enemy Unit that is Lv.4 or lower as its attack target.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
