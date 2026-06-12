import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd03Eternal131: BaseCard = {
  cardNumber: "GD03-131",
  name: "Eternal",
  type: "base",
  traits: ["triple ship alliance", "warship"],
  id: "GD03-131",
  externalId: "gundam:gd03-131",
  slug: "eternal-gd03-131",
  displayName: "Eternal",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-131",
  printings: [
    {
      id: "GD03-131",
      collectorNumber: "GD03-131",
      cardNumber: "GD03-131",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-131.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-131.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-131",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-131.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-131.webp?260424",
  legality: "legal",
  level: 5,
  cost: 2,
  hp: 5,
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand. Then, if you have 2 or more (Triple Ship Alliance) Units in play, choose 1 enemy Unit that is Lv.4 or lower. Return it to its owner's hand.",
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
          condition: {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 2,
            hasTrait: "triple ship alliance",
          },
          thenDirectives: [
            {
              action: {
                action: "returnToHand",
                target: {
                  owner: "opponent",
                  cardType: "unit",
                  count: 1,
                  attributeFilters: [{ attribute: "level", comparison: "lte", value: 4 }],
                },
              },
            },
          ],
        },
      ],
      sourceText:
        "【Deploy】Add 1 of your Shields to your hand. Then, if you have 2 or more (Triple Ship Alliance) Units in play, choose 1 enemy Unit that is Lv.4 or lower. Return it to its owner's hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
