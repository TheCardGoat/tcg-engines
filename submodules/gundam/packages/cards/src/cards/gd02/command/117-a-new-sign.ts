import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd02ANewSign117: CommandCard = {
  cardNumber: "GD02-117",
  name: "A New Sign",
  type: "command",
  color: "white",
  traits: ["-"],
  id: "GD02-117",
  externalId: "gundam:gd02-117",
  slug: "a-new-sign-gd02-117",
  displayName: "A New Sign",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-117",
  printings: [
    {
      id: "GD02-117",
      collectorNumber: "GD02-117",
      cardNumber: "GD02-117",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-117.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-117.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-117_p1",
      collectorNumber: "GD02-117_p1",
      cardNumber: "GD02-117",
      set: {
        code: "GD02",
        name: "Newtype Challenge 2025 Mission 2",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-117_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-117_p1.webp?260424",
      productName: "Newtype Challenge 2025 Mission 2",
    },
  ],
  selectedPrintingId: "GD02-117",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-117.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-117.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  effect:
    "【Burst】Choose 1 (AEUG) Base card from your trash. Add it to your hand.<br>【Main】Draw 3. Then, discard 2.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "addFromTrash",
            target: {
              owner: "friendly",
              cardType: "base",
              zone: "trash",
              count: 1,
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "AEUG" }],
            },
          },
        },
      ],
      sourceText: "【Burst】Choose 1 (AEUG) Base card from your trash. Add it to your hand.",
    },
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "draw",
            count: 3,
          },
        },
        {
          action: {
            action: "discard",
            count: 2,
          },
        },
      ],
      sourceText: "【Main】Draw 3. Then, discard 2.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
