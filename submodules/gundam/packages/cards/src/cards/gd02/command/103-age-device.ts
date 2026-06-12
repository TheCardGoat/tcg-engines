import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd02AgeDevice103: CommandCard = {
  cardNumber: "GD02-103",
  name: "AGE Device",
  type: "command",
  color: "green",
  traits: ["-"],
  id: "GD02-103",
  externalId: "gundam:gd02-103",
  slug: "age-device-gd02-103",
  displayName: "AGE Device",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-103",
  printings: [
    {
      id: "GD02-103",
      collectorNumber: "GD02-103",
      cardNumber: "GD02-103",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-103.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-103.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-103_p1",
      collectorNumber: "GD02-103_p1",
      cardNumber: "GD02-103",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-103_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-103_p1.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-103",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-103.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-103.webp?260424",
  legality: "legal",
  level: 4,
  cost: 2,
  effect:
    "【Burst】Choose 1 (Asuno Family) Pilot card from your trash. Add it to your hand.<br>【Main】If you have an (AGE System) Unit in play, place 1 EX Resource.<br>",
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
              cardType: "pilot",
              zone: "trash",
              count: 1,
              attributeFilters: [
                { attribute: "trait", comparison: "includes", value: "Asuno Family" },
              ],
            },
          },
        },
      ],
      sourceText:
        "【Burst】Choose 1 (Asuno Family) Pilot card from your trash. Add it to your hand.",
    },
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          condition: {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            hasTrait: "age system",
          },
          thenDirectives: [
            {
              action: {
                action: "placeResource",
                resourceType: "EX",
                state: "active",
              },
            },
          ],
        },
      ],
      sourceText: "【Main】If you have an (AGE System) Unit in play, place 1 EX Resource.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
