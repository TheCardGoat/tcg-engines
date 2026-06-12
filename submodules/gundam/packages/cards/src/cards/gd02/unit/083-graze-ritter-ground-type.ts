import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02GrazeRitterGroundType083: UnitCard = {
  cardNumber: "GD02-083",
  name: "Graze Ritter (Ground Type)",
  type: "unit",
  color: "white",
  traits: ["gjallarhorn"],
  id: "GD02-083",
  externalId: "gundam:gd02-083",
  slug: "graze-ritter-ground-type-gd02-083",
  displayName: "Graze Ritter (Ground Type)",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-083",
  printings: [
    {
      id: "GD02-083",
      collectorNumber: "GD02-083",
      cardNumber: "GD02-083",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-083.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-083.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-083",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-083.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-083.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 3,
  hp: 2,
  effect:
    "【Destroyed】If it is your opponent's turn, choose 1 of your (Gjallarhorn) Units. Set it as active.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
      },
      directives: [
        {
          condition: {
            type: "isTurn",
            whose: "opponent",
          },
          thenDirectives: [
            {
              action: {
                action: "setActive",
                target: {
                  owner: "friendly",
                  cardType: "unit",
                  count: 1,
                  attributeFilters: [
                    { attribute: "trait", comparison: "includes", value: "Gjallarhorn" },
                  ],
                },
              },
            },
          ],
        },
      ],
      sourceText:
        "【Destroyed】If it is your opponent's turn, choose 1 of your (Gjallarhorn) Units. Set it as active.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
