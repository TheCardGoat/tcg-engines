import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd04AliAlSaachez099: PilotCard = {
  cardNumber: "GD04-099",
  name: "Ali al-Saachez",
  type: "pilot",
  color: "white",
  traits: ["superpower bloc", "un"],
  id: "GD04-099",
  externalId: "gundam:gd04-099",
  slug: "ali-al-saachez-gd04-099",
  displayName: "Ali al-Saachez",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-099",
  printings: [
    {
      id: "GD04-099",
      collectorNumber: "GD04-099",
      cardNumber: "GD04-099",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-099.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-099.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-099",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-099.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-099.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\n【During Link】【Attack】You may choose 1 enemy Pilot. Return it to its owner's hand.",
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
        timing: ["attack"],
        conditions: [{ type: "duringLink" }],
      },
      directives: [
        {
          action: {
            action: "returnToHand",
            target: {
              owner: "opponent",
              cardType: "pilot",
              count: 1,
            },
          },
          optional: true,
        },
      ],
      sourceText:
        "【During Link】【Attack】You may choose 1 enemy Pilot. Return it to its owner's hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
