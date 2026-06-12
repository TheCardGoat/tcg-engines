import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd03OverTheRiverAndThroughTheWoods107: CommandCard = {
  cardNumber: "GD03-107",
  name: "Over the River and Through the Woods",
  type: "command",
  color: "green",
  traits: ["zeon", "cyclops team"],
  id: "GD03-107",
  externalId: "gundam:gd03-107",
  slug: "over-the-river-and-through-the-woods-gd03-107",
  displayName: "Over the River and Through the Woods",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-107",
  printings: [
    {
      id: "GD03-107",
      collectorNumber: "GD03-107",
      cardNumber: "GD03-107",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-107.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-107.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-107",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-107.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-107.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  pilotName: "Hardie Steiner",
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Main】Choose 1 enemy Unit that is Lv.5 or lower. Deal damage to it equal to the number of friendly Unit tokens in play.\n【Pilot】[Hardie Steiner]",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "dealDamageByCount",
            countFilter: {
              owner: "friendly",
              cardType: "unit",
              isToken: true,
            },
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              attributeFilters: [{ attribute: "level", comparison: "lte", value: 5 }],
            },
          },
        },
      ],
      sourceText:
        "【Main】Choose 1 enemy Unit that is Lv.5 or lower. Deal damage to it equal to the number of friendly Unit tokens in play. 【Pilot】[Hardie Steiner]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
