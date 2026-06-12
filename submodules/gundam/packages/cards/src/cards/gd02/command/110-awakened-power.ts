import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd02AwakenedPower110: CommandCard = {
  cardNumber: "GD02-110",
  name: "Awakened Power",
  type: "command",
  color: "purple",
  traits: ["-"],
  id: "GD02-110",
  externalId: "gundam:gd02-110",
  slug: "awakened-power-gd02-110",
  displayName: "Awakened Power",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-110",
  printings: [
    {
      id: "GD02-110",
      collectorNumber: "GD02-110",
      cardNumber: "GD02-110",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-110.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-110.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-110_p1",
      collectorNumber: "GD02-110_p1",
      cardNumber: "GD02-110",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-110_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-110_p1.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-110_p2",
      collectorNumber: "GD02-110_p2",
      cardNumber: "GD02-110",
      set: {
        code: "ST09",
        name: "Destiny Ignition [ST09]",
        packageId: "616009",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-110_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-110_p2.webp?260424",
      productName: "Destiny Ignition [ST09]",
    },
  ],
  selectedPrintingId: "GD02-110",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-110.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-110.webp?260424",
  legality: "legal",
  level: 6,
  cost: 2,
  effect:
    "【Main】Choose 1 Unit card that is Lv.5 or lower from your trash. Pay its cost to deploy it.<br>",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "deployFromTrash",
            levelAtMost: 5,
            payCost: true,
          },
        },
      ],
      sourceText:
        "【Main】Choose 1 Unit card that is Lv.5 or lower from your trash. Pay its cost to deploy it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
