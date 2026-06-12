import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03HizackCustom014: UnitCard = {
  cardNumber: "GD03-014",
  name: "Hizack Custom",
  type: "unit",
  color: "blue",
  traits: ["titans"],
  id: "GD03-014",
  externalId: "gundam:gd03-014",
  slug: "hizack-custom-gd03-014",
  displayName: "Hizack Custom",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-014",
  printings: [
    {
      id: "GD03-014",
      collectorNumber: "GD03-014",
      cardNumber: "GD03-014",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-014.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-014.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-014",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-014.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-014.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 3,
  hp: 2,
  effect: "While you have 2 or more (Titans) Units in play, this card in your hand gets cost -1.",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 2,
            hasTrait: "titans",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "costReduction",
            amount: 1,
            target: {
              owner: "self",
            },
          },
        },
      ],
      sourceText:
        "While you have 2 or more (Titans) Units in play, this card in your hand gets cost -1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
