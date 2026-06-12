import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const st08Valiant014: BaseCard = {
  cardNumber: "ST08-014",
  name: "Valiant",
  type: "base",
  traits: ["mafty", "warship"],
  id: "ST08-014",
  externalId: "gundam:st08-014",
  slug: "valiant-st08-014",
  displayName: "Valiant",
  set: { code: "ST08", name: "Flash of Radiance [ST08]", packageId: "616008" },
  printNumber: "ST08-014",
  printings: [
    {
      id: "ST08-014",
      collectorNumber: "ST08-014",
      cardNumber: "ST08-014",
      set: {
        code: "ST08",
        name: "Flash of Radiance [ST08]",
        packageId: "616008",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-014.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-014.webp?260424",
      productName: "Flash of Radiance [ST08]",
    },
    {
      id: "ST08-014_p1",
      collectorNumber: "ST08-014_p1",
      cardNumber: "ST08-014",
      set: {
        code: "ST08",
        name: "Flash of Radiance [ST08] Bonus Pack",
        packageId: "616008",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-014_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-014_p1.webp?260424",
      productName: "Flash of Radiance [ST08] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST08-014",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-014.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-014.webp?260424",
  legality: "legal",
  level: 2,
  cost: 1,
  hp: 5,
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand. Then, choose 1 of your Units. It gets AP+2 during this turn.",
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
            action: "statModifier",
            stat: "ap",
            amount: 2,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Deploy】Add 1 of your Shields to your hand. Then, choose 1 of your Units. It gets AP+2 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
