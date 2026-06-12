import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd03ZeheartGalette094: PilotCard = {
  cardNumber: "GD03-094",
  name: "Zeheart Galette",
  type: "pilot",
  color: "purple",
  traits: ["vagan", "x-rounder"],
  id: "GD03-094",
  externalId: "gundam:gd03-094",
  slug: "zeheart-galette-gd03-094",
  displayName: "Zeheart Galette",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-094",
  printings: [
    {
      id: "GD03-094",
      collectorNumber: "GD03-094",
      cardNumber: "GD03-094",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-094.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-094.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-094_p1",
      collectorNumber: "GD03-094_p1",
      cardNumber: "GD03-094",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-094_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-094_p1.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-094",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-094.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-094.webp?260424",
  legality: "legal",
  level: 5,
  cost: 1,
  apBonus: 2,
  hpBonus: 2,
  effect:
    "【Burst】Add this card to your hand.\n【When Paired】Place the top 2 cards of your deck into your trash. If you placed a (Vagan) card with this effect, choose 1 enemy Unit. It gets AP-2 during this turn.",
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
        timing: ["whenPaired"],
      },
      directives: [
        {
          action: {
            action: "millDeckThenStatModifierIfTrait",
            count: 2,
            owner: "self",
            traits: "vagan",
            stat: "ap",
            amount: -2,
            duration: "thisTurn",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【When Paired】Place the top 2 cards of your deck into your trash. If you placed a (Vagan) card with this effect, choose 1 enemy Unit. It gets AP-2 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
