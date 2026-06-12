import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd03AwkwardApproach119: CommandCard = {
  cardNumber: "GD03-119",
  name: "Awkward Approach",
  type: "command",
  color: "white",
  traits: [],
  id: "GD03-119",
  externalId: "gundam:gd03-119",
  slug: "awkward-approach-gd03-119",
  displayName: "Awkward Approach",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-119",
  printings: [
    {
      id: "GD03-119",
      collectorNumber: "GD03-119",
      cardNumber: "GD03-119",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-119.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-119.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-119",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-119.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-119.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  effect:
    "【Main】Choose 1 rested friendly Base. Set it as active. If you do, all enemy Units get AP-1 during this turn.",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "setActive",
            target: {
              owner: "friendly",
              cardType: "base",
              state: "rested",
              count: 1,
            },
          },
        },
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: -1,
            duration: "thisTurn",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: "all",
            },
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【Main】Choose 1 rested friendly Base. Set it as active. If you do, all enemy Units get AP-1 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
