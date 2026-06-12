import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd04NenaTrinity089: PilotCard = {
  cardNumber: "GD04-089",
  name: "Nena Trinity",
  type: "pilot",
  color: "red",
  traits: ["cb", "trinity"],
  id: "GD04-089",
  externalId: "gundam:gd04-089",
  slug: "nena-trinity-gd04-089",
  displayName: "Nena Trinity",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-089",
  printings: [
    {
      id: "GD04-089",
      collectorNumber: "GD04-089",
      cardNumber: "GD04-089",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-089.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-089.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-089_p1",
      collectorNumber: "GD04-089_p1",
      cardNumber: "GD04-089",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-089_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-089_p1.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-089",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-089.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-089.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 0,
  hpBonus: 3,
  effect:
    "【Burst】Add this card to your hand.\n【Activate･Main】<Support 2> (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)",
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
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Support", value: 2 }],
  rarity: "rare",
};
