import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd03Radish132: BaseCard = {
  cardNumber: "GD03-132",
  name: "Radish",
  type: "base",
  traits: ["aeug", "warship"],
  id: "GD03-132",
  externalId: "gundam:gd03-132",
  slug: "radish-gd03-132",
  displayName: "Radish",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-132",
  printings: [
    {
      id: "GD03-132",
      collectorNumber: "GD03-132",
      cardNumber: "GD03-132",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-132.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-132.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-132",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-132.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-132.webp?260424",
  legality: "legal",
  level: 2,
  cost: 1,
  hp: 5,
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\r\n【Destroyed】If you have an (AEUG) Link Unit in play, choose 1 enemy Unit with 4 or less HP. Rest it.",
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
      ],
      sourceText: "【Deploy】Add 1 of your Shields to your hand.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
        conditions: [
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            hasTrait: "aeug",
            isLinkUnit: true,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              attributeFilters: [{ attribute: "hp", comparison: "lte", value: 4 }],
            },
          },
        },
      ],
      sourceText:
        "【Destroyed】If you have an (AEUG) Link Unit in play, choose 1 enemy Unit with 4 or less HP. Rest it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
