import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd04MarbetFingerhat083: PilotCard = {
  cardNumber: "GD04-083",
  name: "Marbet Fingerhat",
  type: "pilot",
  color: "blue",
  traits: ["league militaire"],
  id: "GD04-083",
  externalId: "gundam:gd04-083",
  slug: "marbet-fingerhat-gd04-083",
  displayName: "Marbet Fingerhat",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-083",
  printings: [
    {
      id: "GD04-083",
      collectorNumber: "GD04-083",
      cardNumber: "GD04-083",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-083.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-083.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-083",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-083.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-083.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  apBonus: 1,
  hpBonus: 1,
  effect: "【Burst】Add this card to your hand.\nAll your (League Militaire) Unit tokens get AP+1.",
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
      activation: {
        conditions: [{ type: "duringPair" }],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 1,
            duration: "permanent",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: "all",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "league militaire",
                },
              ],
              isToken: true,
            },
          },
        },
      ],
      sourceText: "All your (League Militaire) Unit tokens get AP+1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
