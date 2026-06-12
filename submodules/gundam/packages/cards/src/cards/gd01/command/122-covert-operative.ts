import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd01CovertOperative122: CommandCard = {
  cardNumber: "GD01-122",
  name: "Covert Operative",
  type: "command",
  color: "white",
  traits: ["academy"],
  id: "GD01-122",
  externalId: "gundam:gd01-122",
  slug: "covert-operative-gd01-122",
  displayName: "Covert Operative",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-122",
  printings: [
    {
      id: "GD01-122",
      collectorNumber: "GD01-122",
      cardNumber: "GD01-122",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-122.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-122.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-122",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-122.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-122.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  pilotName: "Shaddiq Zenelli",
  apBonus: 1,
  hpBonus: 0,
  effect:
    "【Main】Choose 1 enemy Unit with 2 or less HP. Return it to its owner's hand. If you have a Link Unit in play, choose 1 enemy Unit with 4 or less HP instead.<br>【Pilot】[Shaddiq Zenelli]<br>",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          condition: {
            type: "unitCount",
            owner: "friendly",
            isLinkUnit: true,
            comparison: "gte",
            count: 1,
          },
          thenDirectives: [
            {
              action: {
                action: "returnToHand",
                target: {
                  owner: "opponent",
                  cardType: "unit",
                  attributeFilters: [
                    {
                      attribute: "hp",
                      comparison: "lte",
                      value: 4,
                    },
                  ],
                  count: 1,
                },
              },
            },
          ],
          elseDirectives: [
            {
              action: {
                action: "returnToHand",
                target: {
                  owner: "opponent",
                  cardType: "unit",
                  attributeFilters: [
                    {
                      attribute: "hp",
                      comparison: "lte",
                      value: 2,
                    },
                  ],
                  count: 1,
                },
              },
            },
          ],
        },
      ],
      sourceText:
        "【Main】Choose 1 enemy Unit with 2 or less HP. Return it to its owner's hand. If you have a Link Unit in play, choose 1 enemy Unit with 4 or less HP instead. 【Pilot】[Shaddiq Zenelli]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
