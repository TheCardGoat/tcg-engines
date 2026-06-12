import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd02KamilleBidan097: PilotCard = {
  cardNumber: "GD02-097",
  name: "Kamille Bidan",
  type: "pilot",
  color: "white",
  traits: ["aeug", "newtype"],
  id: "GD02-097",
  externalId: "gundam:gd02-097",
  slug: "kamille-bidan-gd02-097",
  displayName: "Kamille Bidan",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-097",
  printings: [
    {
      id: "GD02-097",
      collectorNumber: "GD02-097",
      cardNumber: "GD02-097",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-097.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-097.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-097_p1",
      collectorNumber: "GD02-097_p1",
      cardNumber: "GD02-097",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-097_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-097_p1.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-097_p2",
      collectorNumber: "GD02-097_p2",
      cardNumber: "GD02-097",
      set: {
        code: "GD02",
        name: "Newtype Challenge 2025 Mission 2",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-097_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-097_p2.webp?260424",
      productName: "Newtype Challenge 2025 Mission 2",
    },
  ],
  selectedPrintingId: "GD02-097",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-097.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-097.webp?260424",
  legality: "legal",
  level: 5,
  cost: 1,
  apBonus: 1,
  hpBonus: 2,
  effect:
    "【Burst】Add this card to your hand.<br>While there is a friendly white Base in play, this Unit gets AP+2.<br>",
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
      type: "constant",
      activation: {},
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 2,
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText: "While there is a friendly white Base in play, this Unit gets AP+2.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
