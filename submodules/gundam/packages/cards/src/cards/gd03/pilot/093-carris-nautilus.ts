import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd03CarrisNautilus093: PilotCard = {
  cardNumber: "GD03-093",
  name: "Carris Nautilus",
  type: "pilot",
  color: "red",
  traits: ["sra", "newtype"],
  id: "GD03-093",
  externalId: "gundam:gd03-093",
  slug: "carris-nautilus-gd03-093",
  displayName: "Carris Nautilus",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-093",
  printings: [
    {
      id: "GD03-093",
      collectorNumber: "GD03-093",
      cardNumber: "GD03-093",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-093.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-093.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-093",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-093.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-093.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\nWhile no enemy Base is in play, this Unit gets AP+1.",
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
        conditions: [
          {
            type: "cardInZone",
            owner: "opponent",
            zone: "baseSection",
            cardType: "base",
            comparison: "eq",
            count: 0,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 1,
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText: "While no enemy Base is in play, this Unit gets AP+1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
