import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03GrazeEin073: UnitCard = {
  cardNumber: "GD03-073",
  name: "Graze Ein",
  type: "unit",
  color: "white",
  traits: ["gjallarhorn"],
  id: "GD03-073",
  externalId: "gundam:gd03-073",
  slug: "graze-ein-gd03-073",
  displayName: "Graze Ein",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-073",
  printings: [
    {
      id: "GD03-073",
      collectorNumber: "GD03-073",
      cardNumber: "GD03-073",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-073.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-073.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-073_p1",
      collectorNumber: "GD03-073_p1",
      cardNumber: "GD03-073",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-073_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-073_p1.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-073",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-073.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-073.webp?260424",
  legality: "legal",
  level: 7,
  cost: 5,
  ap: 6,
  hp: 4,
  linkCondition: "[Ein Dalton]",
  effect:
    "<Blocker> (Rest this Unit to change the attack target to it.)\n【During Link】【Activate･Action】【Once per Turn】If there are 6 or more (Gjallarhorn) cards in your trash, choose 1 enemy Unit battling this Unit. It gets AP-3 during this battle.",
  effects: [
    {
      type: "activated",
      activation: {
        timing: ["activate:action"],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
        conditions: [
          { type: "duringLink" },
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            cardType: "unit",
            comparison: "gte",
            count: 6,
            hasTrait: "gjallarhorn",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: -3,
            duration: "thisBattle",
            target: {
              owner: "opponent",
              cardType: "unit",
              isBattling: true,
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【During Link】【Activate·Action】【Once per Turn】If there are 6 or more (Gjallarhorn) cards in your trash, choose 1 enemy Unit battling this Unit. It gets AP-3 during this battle.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Blocker" }],
  rarity: "rare",
};
