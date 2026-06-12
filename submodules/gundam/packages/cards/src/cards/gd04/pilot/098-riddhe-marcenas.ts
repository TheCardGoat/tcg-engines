import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd04RiddheMarcenas098: PilotCard = {
  cardNumber: "GD04-098",
  name: "Riddhe Marcenas",
  type: "pilot",
  color: "white",
  traits: ["earth federation", "newtype"],
  id: "GD04-098",
  externalId: "gundam:gd04-098",
  slug: "riddhe-marcenas-gd04-098",
  displayName: "Riddhe Marcenas",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-098",
  printings: [
    {
      id: "GD04-098",
      collectorNumber: "GD04-098",
      cardNumber: "GD04-098",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-098.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-098.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-098",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-098.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-098.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 1,
  hpBonus: 2,
  effect:
    "【Burst】Add this card to your hand.\n【During Link】When this Unit receives effect damage from an enemy, reduce it by 2.",
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
        conditions: [{ type: "duringLink" }],
      },
      directives: [
        {
          action: {
            action: "reduceNextDamage",
            amount: 2,
            target: { owner: "self" },
            damageType: "effect",
            source: "enemy",
            duration: "permanent",
          },
        },
      ],
      sourceText:
        "【During Link】When this Unit receives effect damage from an enemy, reduce it by 2.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
