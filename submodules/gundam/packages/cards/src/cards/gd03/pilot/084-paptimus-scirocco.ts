import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd03PaptimusScirocco084: PilotCard = {
  cardNumber: "GD03-084",
  name: "Paptimus Scirocco",
  type: "pilot",
  color: "blue",
  traits: ["titans", "jupitris", "newtype"],
  id: "GD03-084",
  externalId: "gundam:gd03-084",
  slug: "paptimus-scirocco-gd03-084",
  displayName: "Paptimus Scirocco",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-084",
  printings: [
    {
      id: "GD03-084",
      collectorNumber: "GD03-084",
      cardNumber: "GD03-084",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-084.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-084.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-084_p1",
      collectorNumber: "GD03-084_p1",
      cardNumber: "GD03-084",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-084_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-084_p1.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-084",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-084.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-084.webp?260424",
  legality: "legal",
  level: 5,
  cost: 1,
  apBonus: 2,
  hpBonus: 2,
  effect:
    "【Burst】Add this card to your hand.\n【When Linked】Choose 1 of your other Units. It gains <Repair 2> during this turn. Then, if it is a (Jupitris) Unit, draw 1.\n\r\n(At the end of your turn, this Unit recovers the specified number of HP.)",
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
        timing: ["whenLinked"],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Repair",
            keywordValue: 2,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              excludeSource: true,
            },
          },
        },
        {
          action: {
            action: "drawIfTargetMatches",
            count: 1,
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              excludeSource: true,
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "jupitris" }],
            },
          },
        },
      ],
      sourceText:
        "【When Linked】Choose 1 of your other Units. It gains <Repair 2> during this turn. Then, if it is a (Jupitris) Unit, draw 1. (At the end of your turn, this Unit recovers the specified number of HP.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
