import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04GundamLeopardDestroy052: UnitCard = {
  cardNumber: "GD04-052",
  name: "Gundam Leopard Destroy",
  type: "unit",
  color: "purple",
  traits: ["vulture"],
  id: "GD04-052",
  externalId: "gundam:gd04-052",
  slug: "gundam-leopard-destroy-gd04-052",
  displayName: "Gundam Leopard Destroy",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-052",
  printings: [
    {
      id: "GD04-052",
      collectorNumber: "GD04-052",
      cardNumber: "GD04-052",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-052.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-052.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-052",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-052.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-052.webp?260424",
  legality: "legal",
  level: 6,
  cost: 4,
  ap: 4,
  hp: 5,
  linkCondition: "(Vulture) Trait",
  effect:
    "【During Pair】【Attack】You may choose 1 enemy Unit. Deal 2 damage to it and this Unit.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [{ type: "duringPair" }],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 2,
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
        {
          action: {
            action: "dealDamage",
            amount: 2,
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "【During Pair】【Attack】You may choose 1 enemy Unit. Deal 2 damage to it and this Unit.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
