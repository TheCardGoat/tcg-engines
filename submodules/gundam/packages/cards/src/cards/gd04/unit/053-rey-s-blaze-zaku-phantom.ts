import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04ReySBlazeZakuPhantom053: UnitCard = {
  cardNumber: "GD04-053",
  name: "Rey's Blaze Zaku Phantom",
  type: "unit",
  color: "purple",
  traits: ["zaft", "minerva squad"],
  id: "GD04-053",
  externalId: "gundam:gd04-053",
  slug: "rey-s-blaze-zaku-phantom-gd04-053",
  displayName: "Rey's Blaze Zaku Phantom",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-053",
  printings: [
    {
      id: "GD04-053",
      collectorNumber: "GD04-053",
      cardNumber: "GD04-053",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-053.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-053.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-053_p1",
      collectorNumber: "GD04-053_p1",
      cardNumber: "GD04-053",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-053_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-053_p1.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-053",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-053.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-053.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 4,
  hp: 3,
  linkCondition: "(Minerva Squad) Trait",
  effect:
    "【During Link】【Once per Turn】When this Unit receives damage from an enemy, reduce it by 1.",
  effects: [
    {
      type: "constant",
      activation: {
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
        conditions: [{ type: "duringLink" }],
      },
      directives: [
        {
          action: {
            action: "reduceNextDamage",
            amount: 1,
            target: { owner: "self", cardType: "unit" },
            source: "enemy",
            duration: "permanent",
          },
        },
      ],
      sourceText:
        "【During Link】【Once per Turn】When this Unit receives damage from an enemy, reduce it by 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
