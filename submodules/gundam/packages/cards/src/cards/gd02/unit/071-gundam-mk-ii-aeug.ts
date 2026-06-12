import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02GundamMkIiAeug071: UnitCard = {
  cardNumber: "GD02-071",
  name: "Gundam Mk-II (AEUG)",
  type: "unit",
  color: "white",
  traits: ["aeug"],
  id: "GD02-071",
  externalId: "gundam:gd02-071",
  slug: "gundam-mk-ii-aeug-gd02-071",
  displayName: "Gundam Mk-II (AEUG)",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-071",
  printings: [
    {
      id: "GD02-071",
      collectorNumber: "GD02-071",
      cardNumber: "GD02-071",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-071.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-071.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-071",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-071.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-071.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 3,
  hp: 4,
  effect:
    "【Deploy】If a friendly white Base is in play, you may pair 1 (AEUG) Pilot card from your hand with this Unit.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
        conditions: [{ type: "friendlyBaseInPlay", color: "white" }],
      },
      directives: [
        {
          action: {
            action: "pairPilot",
            target: {
              owner: "friendly",
              cardType: "pilot",
              zone: "hand",
              count: 1,
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "aeug",
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "【Deploy】If a friendly white Base is in play, you may pair 1 (AEUG) Pilot card from your hand with this Unit.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
