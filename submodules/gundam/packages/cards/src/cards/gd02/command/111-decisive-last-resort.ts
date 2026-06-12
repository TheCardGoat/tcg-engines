import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd02DecisiveLastResort111: CommandCard = {
  cardNumber: "GD02-111",
  name: "Decisive Last Resort",
  type: "command",
  color: "purple",
  traits: ["-"],
  id: "GD02-111",
  externalId: "gundam:gd02-111",
  slug: "decisive-last-resort-gd02-111",
  displayName: "Decisive Last Resort",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-111",
  printings: [
    {
      id: "GD02-111",
      collectorNumber: "GD02-111",
      cardNumber: "GD02-111",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-111.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-111.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-111",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-111.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-111.webp?260424",
  legality: "legal",
  level: 5,
  cost: 4,
  effect:
    "【Burst】Choose 1 enemy Unit that is Lv.3 or lower. Deal 2 damage to it.<br>【Main】Choose 6 purple Unit cards from your trash. Exile them from the game. If you do, choose 1 enemy Unit. Destroy it.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 2,
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 3,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Burst】Choose 1 enemy Unit that is Lv.3 or lower. Deal 2 damage to it.",
    },
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "exile",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 6,
              zone: "trash",
              attributeFilters: [{ attribute: "color", comparison: "eq", value: "purple" }],
            },
          },
        },
        {
          action: {
            action: "destroy",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
          // "If you do, ..." — only destroy if the preceding exile
          // actually landed 6 purple Unit cards from trash.
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【Main】Choose 6 purple Unit cards from your trash. Exile them from the game. If you do, choose 1 enemy Unit. Destroy it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
