import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd03AHealthyCuriosity101: CommandCard = {
  cardNumber: "GD03-101",
  name: "A Healthy Curiosity",
  type: "command",
  color: "blue",
  traits: [],
  id: "GD03-101",
  externalId: "gundam:gd03-101",
  slug: "a-healthy-curiosity-gd03-101",
  displayName: "A Healthy Curiosity",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-101",
  printings: [
    {
      id: "GD03-101",
      collectorNumber: "GD03-101",
      cardNumber: "GD03-101",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-101.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-101.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-101_p1",
      collectorNumber: "GD03-101_p1",
      cardNumber: "GD03-101",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-101_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-101_p1.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-101",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-101.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-101.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  effect:
    '【Main】Draw 1. Then, if there are 2 or more cards with "A Healthy Curiosity" in their card name in your trash, choose 1 enemy Unit with 4 or less HP. Rest it.',
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "draw",
            count: 1,
          },
        },
        {
          condition: {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            cardType: "command",
            comparison: "gte",
            count: 2,
            hasName: "A Healthy Curiosity",
          },
          thenDirectives: [
            {
              action: {
                action: "rest",
                target: {
                  owner: "opponent",
                  cardType: "unit",
                  count: 1,
                  attributeFilters: [
                    {
                      attribute: "hp",
                      comparison: "lte",
                      value: 4,
                    },
                  ],
                },
              },
            },
          ],
        },
      ],
      sourceText:
        '【Main】Draw 1. Then, if there are 2 or more cards with "A Healthy Curiosity" in their card name in your trash, choose 1 enemy Unit with 4 or less HP. Rest it.',
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
