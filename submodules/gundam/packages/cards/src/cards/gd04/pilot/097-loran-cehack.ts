import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd04LoranCehack097: PilotCard = {
  cardNumber: "GD04-097",
  name: "Loran Cehack",
  type: "pilot",
  color: "white",
  traits: ["militia", "moonrace"],
  id: "GD04-097",
  externalId: "gundam:gd04-097",
  slug: "loran-cehack-gd04-097",
  displayName: "Loran Cehack",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-097",
  printings: [
    {
      id: "GD04-097",
      collectorNumber: "GD04-097",
      cardNumber: "GD04-097",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-097.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-097.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-097_p1",
      collectorNumber: "GD04-097_p1",
      cardNumber: "GD04-097",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-097_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-097_p1.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-097",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-097.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-097.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\n【When Linked】Choose 1 enemy Unit with 3 or less HP. Return it to its owner's hand.",
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
      type: "triggered",
      activation: {
        timing: ["whenLinked"],
      },
      directives: [
        {
          action: {
            action: "returnToHand",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "hp",
                  comparison: "lte",
                  value: 3,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【When Linked】Choose 1 enemy Unit with 3 or less HP. Return it to its owner's hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
