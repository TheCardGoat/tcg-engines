import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const betaFalmel016: BaseCard = {
  cardNumber: "ST03-016",
  name: "Falmel",
  type: "base",
  traits: ["zeon", "battleship"],
  id: "ST03-016_p2",
  externalId: "gundam:st03-016_p2",
  slug: "falmel-st03-016-p2",
  displayName: "Falmel",
  set: { code: "BETA", name: "Edition Beta", packageId: "616000" },
  printNumber: "ST03-016_p2",
  printings: [
    {
      id: "ST03-016",
      collectorNumber: "ST03-016",
      cardNumber: "ST03-016",
      set: {
        code: "ST03",
        name: "Zeon's Rush [ST03]",
        packageId: "616003",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st03/ST03-016.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-016.webp?260424",
      productName: "Zeon's Rush [ST03]",
    },
    {
      id: "ST03-016_p1",
      collectorNumber: "ST03-016_p1",
      cardNumber: "ST03-016",
      set: {
        code: "ST03",
        name: "Zeon's Rush [ST03] Bonus Pack",
        packageId: "616003",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st03/ST03-016_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-016_p1.webp?260424",
      productName: "Zeon's Rush [ST03] Bonus Pack",
    },
    {
      id: "ST03-016_p2",
      collectorNumber: "ST03-016_p2",
      cardNumber: "ST03-016",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/ST03-016_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-016_p2.webp?260424",
      productName: "Edition Beta",
    },
  ],
  selectedPrintingId: "ST03-016_p2",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/ST03-016_p2.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-016_p2.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  hp: 5,
  effect:
    "【Burst】Deploy this card.<br>【Deploy】Add 1 of your Shields to your hand. Then, if it is your turn, deploy 1 rested [Char's Zaku Ⅱ]((Zeon)･AP3･HP1) Unit token.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "deploySelf",
          },
        },
      ],
      sourceText: "【Burst】Deploy this card.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "addShieldToHand",
            count: 1,
          },
        },
        {
          action: {
            action: "deployToken",
            token: {
              name: "Char's Zaku Ⅱ",
              traits: ["zeon"],
              ap: 3,
              hp: 1,
              deployState: "rested",
              printedCardNumber: "T-006",
            },
          },
        },
      ],
      sourceText:
        "【Deploy】Add 1 of your Shields to your hand. Then, if it is your turn, deploy 1 rested [Char's Zaku Ⅱ]((Zeon)·AP3·HP1) Unit token.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
