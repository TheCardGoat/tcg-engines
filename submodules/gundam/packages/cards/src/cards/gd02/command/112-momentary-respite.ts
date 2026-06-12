import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd02MomentaryRespite112: CommandCard = {
  cardNumber: "GD02-112",
  name: "Momentary Respite",
  type: "command",
  color: "purple",
  traits: ["-"],
  id: "GD02-112",
  externalId: "gundam:gd02-112",
  slug: "momentary-respite-gd02-112",
  displayName: "Momentary Respite",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-112",
  printings: [
    {
      id: "GD02-112",
      collectorNumber: "GD02-112",
      cardNumber: "GD02-112",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-112.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-112.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-112_p1",
      collectorNumber: "GD02-112_p1",
      cardNumber: "GD02-112",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-112_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-112_p1.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-112_p2",
      collectorNumber: "GD02-112_p2",
      cardNumber: "GD02-112",
      set: {
        code: "GD02",
        name: "Store Tournament Participant Pack 02",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-112_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-112_p2.webp?260424",
      productName: "Store Tournament Participant Pack 02",
    },
    {
      id: "GD02-112_p3",
      collectorNumber: "GD02-112_p3",
      cardNumber: "GD02-112",
      set: {
        code: "GD02",
        name: "Store Tournament Winner Pack 02",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-112_p3.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-112_p3.webp?260424",
      productName: "Store Tournament Winner Pack 02",
    },
  ],
  selectedPrintingId: "GD02-112",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-112.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-112.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  effect:
    "【Burst】Draw 1.<br>【Main】Choose 1 purple Pilot card from your trash. Add it to your hand.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "draw",
            count: 1,
          },
        },
      ],
      sourceText: "【Burst】Draw 1.",
    },
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "addFromTrash",
            target: {
              owner: "friendly",
              cardType: "pilot",
              zone: "trash",
              count: 1,
              attributeFilters: [{ attribute: "color", comparison: "eq", value: "purple" }],
            },
          },
        },
      ],
      sourceText: "【Main】Choose 1 purple Pilot card from your trash. Add it to your hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
