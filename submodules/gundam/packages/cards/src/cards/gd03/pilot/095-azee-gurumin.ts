import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd03AzeeGurumin095: PilotCard = {
  cardNumber: "GD03-095",
  name: "Azee Gurumin",
  type: "pilot",
  color: "purple",
  traits: ["teiwaz"],
  id: "GD03-095",
  externalId: "gundam:gd03-095",
  slug: "azee-gurumin-gd03-095",
  displayName: "Azee Gurumin",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-095",
  printings: [
    {
      id: "GD03-095",
      collectorNumber: "GD03-095",
      cardNumber: "GD03-095",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-095.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-095.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-095",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-095.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-095.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 1,
  hpBonus: 2,
  effect:
    "【Burst】Add this card to your hand.\n【Once per Turn】When this Unit receives effect damage, choose 1 enemy Unit. It gets AP-1 during this turn.",
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
        timing: ["onEnemyEffectDamage"],
        conditions: [{ type: "eventCardIsSelf" }],
        restrictions: [{ type: "oncePerTurn" }],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: -1,
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
        "【Once per Turn】When this Unit receives effect damage, choose 1 enemy Unit. It gets AP-1 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
