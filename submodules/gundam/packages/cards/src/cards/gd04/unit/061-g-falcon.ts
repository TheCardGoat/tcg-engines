import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04GFalcon061: UnitCard = {
  cardNumber: "GD04-061",
  name: "G-Falcon",
  type: "unit",
  color: "purple",
  traits: ["vulture"],
  id: "GD04-061",
  externalId: "gundam:gd04-061",
  slug: "g-falcon-gd04-061",
  displayName: "G-Falcon",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-061",
  printings: [
    {
      id: "GD04-061",
      collectorNumber: "GD04-061",
      cardNumber: "GD04-061",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-061.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-061.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-061",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-061.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-061.webp?260424",
  legality: "legal",
  level: 2,
  cost: 2,
  ap: 3,
  hp: 1,
  linkCondition: "[Pala Sys]",
  effect:
    "<Blocker> (Rest this Unit to change the attack target to it.)\nThis Unit can't attack while there are 6 or less cards in your trash.",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            comparison: "lte",
            count: 6,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "cantAttack",
            duration: "permanent",
            target: { owner: "self", cardType: "unit" },
          },
        },
      ],
      sourceText: "This Unit can't attack while there are 6 or less cards in your trash.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Blocker" }],
  rarity: "common",
};
