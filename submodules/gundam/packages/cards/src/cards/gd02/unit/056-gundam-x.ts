import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02GundamX056: UnitCard = {
  cardNumber: "GD02-056",
  name: "Gundam X",
  type: "unit",
  color: "purple",
  traits: ["vulture"],
  id: "GD02-056",
  externalId: "gundam:gd02-056",
  slug: "gundam-x-gd02-056",
  displayName: "Gundam X",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-056",
  printings: [
    {
      id: "GD02-056",
      collectorNumber: "GD02-056",
      cardNumber: "GD02-056",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-056.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-056.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-056_p1",
      collectorNumber: "GD02-056_p1",
      cardNumber: "GD02-056",
      set: {
        code: "GD02",
        name: "Store Tournament Participant Pack 02",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-056_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-056_p1.webp?260424",
      productName: "Store Tournament Participant Pack 02",
    },
    {
      id: "GD02-056_p2",
      collectorNumber: "GD02-056_p2",
      cardNumber: "GD02-056",
      set: {
        code: "GD02",
        name: "Store Tournament Winner Pack 02",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-056_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-056_p2.webp?260424",
      productName: "Store Tournament Winner Pack 02",
    },
  ],
  selectedPrintingId: "GD02-056",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-056.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-056.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 3,
  hp: 4,
  effect:
    "【During Pair･(Vulture) Pilot】【Destroyed】Choose 1 (Vulture) Unit card that is Lv.5 or higher from your trash. Add it to your hand.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
        qualification: { attribute: "trait", comparison: "includes", value: "vulture" },
        conditions: [{ type: "duringPair" }],
      },
      directives: [
        {
          action: {
            action: "addFromTrash",
            target: {
              owner: "friendly",
              cardType: "unit",
              zone: "trash",
              count: 1,
              attributeFilters: [
                { attribute: "trait", comparison: "includes", value: "Vulture" },
                { attribute: "level", comparison: "gte", value: 5 },
              ],
            },
          },
        },
      ],
      sourceText:
        "【During Pair·(Vulture) Pilot】【Destroyed】Choose 1 (Vulture) Unit card that is Lv.5 or higher from your trash. Add it to your hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
