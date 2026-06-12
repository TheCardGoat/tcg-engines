import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd03JachinDue127: BaseCard = {
  cardNumber: "GD03-127",
  name: "Jachin Due",
  type: "base",
  traits: ["zaft", "stronghold"],
  id: "GD03-127",
  externalId: "gundam:gd03-127",
  slug: "jachin-due-gd03-127",
  displayName: "Jachin Due",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-127",
  printings: [
    {
      id: "GD03-127",
      collectorNumber: "GD03-127",
      cardNumber: "GD03-127",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-127.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-127.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-127",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-127.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-127.webp?260424",
  legality: "legal",
  level: 6,
  cost: 1,
  hp: 6,
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand. Then, Choose 1 friendly (ZAFT) Unit. It gets AP+3 during this turn.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "deploySelf",
          },
        },
      ],
      sourceText: "【Burst】Deploy this card.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "addShieldToHand",
            count: 1,
          },
        },
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 3,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "zaft",
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Deploy】Add 1 of your Shields to your hand. Then, Choose 1 friendly (ZAFT) Unit. It gets AP+3 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
