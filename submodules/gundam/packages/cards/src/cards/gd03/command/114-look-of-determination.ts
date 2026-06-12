import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd03LookOfDetermination114: CommandCard = {
  cardNumber: "GD03-114",
  name: "Look of Determination",
  type: "command",
  color: "purple",
  traits: [],
  id: "GD03-114",
  externalId: "gundam:gd03-114",
  slug: "look-of-determination-gd03-114",
  displayName: "Look of Determination",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-114",
  printings: [
    {
      id: "GD03-114",
      collectorNumber: "GD03-114",
      cardNumber: "GD03-114",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-114.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-114.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-114_p1",
      collectorNumber: "GD03-114_p1",
      cardNumber: "GD03-114",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-114_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-114_p1.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-114_p2",
      collectorNumber: "GD03-114_p2",
      cardNumber: "GD03-114",
      set: {
        code: "GD03",
        name: "Newtype Challenge 2026 Mission 2",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-114_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-114_p2.webp?260424",
      productName: "Newtype Challenge 2026 Mission 2",
    },
  ],
  selectedPrintingId: "GD03-114",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-114.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-114.webp?260424",
  legality: "legal",
  level: 2,
  cost: 2,
  effect:
    "【Burst】Activate this card's 【Action】.\n【Action】Choose 1 active enemy Unit that is Lv.2 or lower. Destroy it. If there are 10 or more cards in your trash, choose 1 active enemy Unit that is Lv.4 or lower instead.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "activateTiming",
            timing: "action",
          },
        },
      ],
      sourceText: "【Burst】Activate this card's 【Action】.",
    },
    {
      type: "command",
      activation: {
        timing: ["action"],
      },
      directives: [
        {
          condition: {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            comparison: "gte",
            count: 10,
          },
          thenDirectives: [
            {
              action: {
                action: "destroy",
                target: {
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
                  count: 1,
                },
              },
            },
          ],
          elseDirectives: [
            {
              action: {
                action: "destroy",
                target: {
                  owner: "opponent",
                  cardType: "unit",
                  state: "active",
                  attributeFilters: [
                    {
                      attribute: "level",
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
        "【Action】Choose 1 active enemy Unit that is Lv.2 or lower. Destroy it. If there are 10 or more cards in your trash, choose 1 active enemy Unit that is Lv.4 or lower instead.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
