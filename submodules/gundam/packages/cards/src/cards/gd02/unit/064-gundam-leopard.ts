import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02GundamLeopard064: UnitCard = {
  cardNumber: "GD02-064",
  name: "Gundam Leopard",
  type: "unit",
  color: "purple",
  traits: ["vulture"],
  id: "GD02-064",
  externalId: "gundam:gd02-064",
  slug: "gundam-leopard-gd02-064",
  displayName: "Gundam Leopard",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-064",
  printings: [
    {
      id: "GD02-064",
      collectorNumber: "GD02-064",
      cardNumber: "GD02-064",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-064.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-064.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-064",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-064.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-064.webp?260424",
  legality: "legal",
  level: 5,
  cost: 4,
  ap: 4,
  hp: 4,
  effect:
    "During your turn, while there are 7 or more cards in your trash, this Unit can't receive effect damage from enemy Commands.<br>",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          { type: "isTurn", whose: "friendly" },
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            comparison: "gte",
            count: 7,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "preventDamage",
            target: { owner: "self" },
            damageType: "effect",
            sourceCardType: "command",
          },
        },
      ],
      sourceText:
        "During your turn, while there are 7 or more cards in your trash, this Unit can't receive effect damage from enemy Commands.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
