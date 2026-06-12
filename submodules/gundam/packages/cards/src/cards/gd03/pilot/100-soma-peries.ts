import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd03SomaPeries100: PilotCard = {
  cardNumber: "GD03-100",
  name: "Soma Peries",
  type: "pilot",
  color: "white",
  traits: ["superpower bloc", "un", "super soldier"],
  id: "GD03-100",
  externalId: "gundam:gd03-100",
  slug: "soma-peries-gd03-100",
  displayName: "Soma Peries",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-100",
  printings: [
    {
      id: "GD03-100",
      collectorNumber: "GD03-100",
      cardNumber: "GD03-100",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-100.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-100.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-100_p1",
      collectorNumber: "GD03-100_p1",
      cardNumber: "GD03-100",
      set: {
        code: "GD03",
        name: "WORLD CHAMPIONSHIPS 26-27 Participation Pack 26-27 Vol.1",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-100_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-100_p1.webp?260424",
      productName: "WORLD CHAMPIONSHIPS 26-27 Participation Pack 26-27 Vol.1",
    },
  ],
  selectedPrintingId: "GD03-100",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-100.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-100.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\n【Destroyed】Choose 1 enemy Unit. It gets AP-3 during this turn.",
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
        timing: ["destroyed"],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: -3,
            duration: "thisTurn",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Destroyed】Choose 1 enemy Unit. It gets AP-3 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
