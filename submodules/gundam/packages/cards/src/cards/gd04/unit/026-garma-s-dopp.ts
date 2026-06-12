import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04GarmaSDopp026: UnitCard = {
  cardNumber: "GD04-026",
  name: "Garma's Dopp",
  type: "unit",
  color: "green",
  traits: ["zeon"],
  id: "GD04-026",
  externalId: "gundam:gd04-026",
  slug: "garma-s-dopp-gd04-026",
  displayName: "Garma's Dopp",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-026",
  printings: [
    {
      id: "GD04-026",
      collectorNumber: "GD04-026",
      cardNumber: "GD04-026",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-026.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-026.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-026",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-026.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-026.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  ap: 1,
  hp: 1,
  linkCondition: "[Garma Zabi]",
  effect:
    "【Deploy】Look at the top card of your deck. Return it to the top of your deck or place it into your trash.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "lookAtTopDeck",
            count: 1,
            return: "topOrTrash",
          },
        },
      ],
      sourceText:
        "【Deploy】Look at the top card of your deck. Return it to the top of your deck or place it into your trash.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
