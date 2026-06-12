import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st03Gouf009: UnitCard = {
  cardNumber: "ST03-009",
  name: "Gouf",
  type: "unit",
  color: "green",
  traits: ["zeon"],
  id: "ST03-009",
  externalId: "gundam:st03-009",
  slug: "gouf-st03-009",
  displayName: "Gouf",
  set: { code: "ST03", name: "Zeon's Rush [ST03]", packageId: "616003" },
  printNumber: "ST03-009",
  printings: [
    {
      id: "ST03-009",
      collectorNumber: "ST03-009",
      cardNumber: "ST03-009",
      set: {
        code: "ST03",
        name: "Zeon's Rush [ST03]",
        packageId: "616003",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st03/ST03-009.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-009.webp?260424",
      productName: "Zeon's Rush [ST03]",
    },
    {
      id: "ST03-009_p1",
      collectorNumber: "ST03-009_p1",
      cardNumber: "ST03-009",
      set: {
        code: "ST03",
        name: "Zeon's Rush [ST03] Bonus Pack",
        packageId: "616003",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st03/ST03-009_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-009_p1.webp?260424",
      productName: "Zeon's Rush [ST03] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST03-009",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st03/ST03-009.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-009.webp?260424",
  legality: "legal",
  level: 3,
  cost: 3,
  ap: 2,
  hp: 3,
  effect: "【Deploy】Deploy 1 rested [Zaku Ⅱ]((Zeon)･AP1･HP1) Unit token.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "deployToken",
            token: {
              name: "Zaku Ⅱ",
              traits: ["zeon"],
              ap: 1,
              hp: 1,
              deployState: "rested",
              printedCardNumber: "T-007",
            },
          },
        },
      ],
      sourceText: "【Deploy】Deploy 1 rested [Zaku Ⅱ]((Zeon)·AP1·HP1) Unit token.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
