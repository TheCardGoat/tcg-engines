import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd02BeneathTheMask101: CommandCard = {
  cardNumber: "GD02-101",
  name: "Beneath the Mask",
  type: "command",
  color: "blue",
  traits: ["-"],
  id: "GD02-101",
  externalId: "gundam:gd02-101",
  slug: "beneath-the-mask-gd02-101",
  displayName: "Beneath the Mask",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-101",
  printings: [
    {
      id: "GD02-101",
      collectorNumber: "GD02-101",
      cardNumber: "GD02-101",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-101.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-101.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-101",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-101.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-101.webp?260424",
  legality: "legal",
  level: 1,
  cost: 1,
  effect: "【Main】/【Action】Choose 1 to 2 enemy Units that are Lv.2 or lower. Rest them.<br>",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 2,
                },
              ],
              count: {
                min: 1,
                max: 2,
              },
            },
          },
        },
      ],
      sourceText: "【Main】/【Action】Choose 1 to 2 enemy Units that are Lv.2 or lower. Rest them.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
