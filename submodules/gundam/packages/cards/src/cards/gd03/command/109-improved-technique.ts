import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd03ImprovedTechnique109: CommandCard = {
  cardNumber: "GD03-109",
  name: "Improved Technique",
  type: "command",
  color: "red",
  traits: [],
  id: "GD03-109",
  externalId: "gundam:gd03-109",
  slug: "improved-technique-gd03-109",
  displayName: "Improved Technique",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-109",
  printings: [
    {
      id: "GD03-109",
      collectorNumber: "GD03-109",
      cardNumber: "GD03-109",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-109.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-109.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-109_p1",
      collectorNumber: "GD03-109_p1",
      cardNumber: "GD03-109",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-109_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-109_p1.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-109_p2",
      collectorNumber: "GD03-109_p2",
      cardNumber: "GD03-109",
      set: {
        code: "GD03",
        name: "WORLD CHAMPIONSHIPS 26-27 Participation Pack 26-27 Vol.1",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-109_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-109_p2.webp?260424",
      productName: "WORLD CHAMPIONSHIPS 26-27 Participation Pack 26-27 Vol.1",
    },
  ],
  selectedPrintingId: "GD03-109",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-109.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-109.webp?260424",
  legality: "legal",
  level: 3,
  cost: 3,
  effect:
    '【Burst】Activate this card\'s 【Main】.\n【Main】/【Action】Choose 1 enemy Unit that is Lv.4 or lower. Deal 3 damage to it. If there are 2 or more cards with "Improved Technique" in their card name in your trash, choose 1 enemy Unit instead.',
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
            timing: "main",
          },
        },
      ],
      sourceText: "【Burst】Activate this card's 【Main】.",
    },
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          condition: {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            cardType: "command",
            comparison: "gte",
            count: 2,
            hasName: "Improved Technique",
          },
          thenDirectives: [
            {
              action: {
                action: "dealDamage",
                amount: 3,
                target: {
                  owner: "opponent",
                  cardType: "unit",
                  count: 1,
                },
              },
            },
          ],
          elseDirectives: [
            {
              action: {
                action: "dealDamage",
                amount: 3,
                target: {
                  owner: "opponent",
                  cardType: "unit",
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
        },
      ],
      sourceText:
        '【Main】/【Action】Choose 1 enemy Unit that is Lv.4 or lower. Deal 3 damage to it. If there are 2 or more cards with "Improved Technique" in their card name in your trash, choose 1 enemy Unit instead.',
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
