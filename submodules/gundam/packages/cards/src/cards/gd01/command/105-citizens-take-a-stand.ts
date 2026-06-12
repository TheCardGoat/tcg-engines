import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd01CitizensTakeAStand105: CommandCard = {
  cardNumber: "GD01-105",
  name: "Citizens, Take a Stand!",
  type: "command",
  color: "green",
  traits: ["-"],
  id: "GD01-105",
  externalId: "gundam:gd01-105",
  slug: "citizens-take-a-stand-gd01-105",
  displayName: "Citizens, Take a Stand!",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-105",
  printings: [
    {
      id: "GD01-105",
      collectorNumber: "GD01-105",
      cardNumber: "GD01-105",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-105.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-105.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-105_p1",
      collectorNumber: "GD01-105_p1",
      cardNumber: "GD01-105",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-105_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-105_p1.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-105_p2",
      collectorNumber: "GD01-105_p2",
      cardNumber: "GD01-105",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/GD01-105_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-105_p2.webp?260424",
      productName: "Edition Beta",
    },
  ],
  selectedPrintingId: "GD01-105",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-105.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-105.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  effect:
    "【Burst】Add this card to your hand.<br>【Main】All your Units get AP+2 during this turn.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "addSelfToHand",
          },
        },
      ],
      sourceText: "【Burst】Add this card to your hand.",
    },
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 2,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: "all",
            },
          },
        },
      ],
      sourceText: "【Main】All your Units get AP+2 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
