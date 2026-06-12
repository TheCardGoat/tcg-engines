import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd03YazanGable086: PilotCard = {
  cardNumber: "GD03-086",
  name: "Yazan Gable",
  type: "pilot",
  color: "blue",
  traits: ["titans"],
  id: "GD03-086",
  externalId: "gundam:gd03-086",
  slug: "yazan-gable-gd03-086",
  displayName: "Yazan Gable",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-086",
  printings: [
    {
      id: "GD03-086",
      collectorNumber: "GD03-086",
      cardNumber: "GD03-086",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-086.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-086.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-086",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-086.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-086.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 1,
  hpBonus: 2,
  effect:
    "【Burst】Add this card to your hand.\n【Attack】Choose 1 of your (Titans) Units whose Lv. is equal to or lower than this Unit. It gets AP+1 during this turn.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "addSelfToHand",
          },
        },
      ],
      sourceText: "【Burst】Add this card to your hand.",
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
            amount: 1,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: {
                    ref: "source",
                    stat: "level",
                  },
                },
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
        "【Attack】Choose 1 of your (Titans) Units whose Lv. is equal to or lower than this Unit. It gets AP+1 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
