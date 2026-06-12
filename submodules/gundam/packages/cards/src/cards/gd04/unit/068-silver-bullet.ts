import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04SilverBullet068: UnitCard = {
  cardNumber: "GD04-068",
  name: "Silver Bullet",
  type: "unit",
  color: "white",
  traits: ["civilian"],
  id: "GD04-068",
  externalId: "gundam:gd04-068",
  slug: "silver-bullet-gd04-068",
  displayName: "Silver Bullet",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-068",
  printings: [
    {
      id: "GD04-068",
      collectorNumber: "GD04-068",
      cardNumber: "GD04-068",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-068.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-068.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-068_p1",
      collectorNumber: "GD04-068_p1",
      cardNumber: "GD04-068",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-068_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-068_p1.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-068",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-068.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-068.webp?260424",
  legality: "legal",
  level: 5,
  cost: 3,
  ap: 4,
  hp: 4,
  linkCondition: "[Gael Chan]",
  effect:
    "<Blocker> (Rest this Unit to change the attack target to it.)\nWhen this Unit receives effect damage from an enemy, reduce it by 3.",
  effects: [
    {
      type: "constant",
      activation: {},
      directives: [
        {
          action: {
            action: "reduceNextDamage",
            amount: 3,
            target: { owner: "self" },
            damageType: "effect",
            source: "enemy",
            duration: "permanent",
          },
        },
      ],
      sourceText: "When this Unit receives effect damage from an enemy, reduce it by 3.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Blocker" }],
  rarity: "rare",
};
