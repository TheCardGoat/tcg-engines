import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const betaSaintGabrielInstitute015: BaseCard = {
  cardNumber: "ST02-015",
  name: "Saint Gabriel Institute",
  type: "base",
  traits: ["academy", "stronghold"],
  id: "ST02-015_p2",
  externalId: "gundam:st02-015_p2",
  slug: "saint-gabriel-institute-st02-015-p2",
  displayName: "Saint Gabriel Institute",
  set: { code: "BETA", name: "Edition Beta", packageId: "616000" },
  printNumber: "ST02-015_p2",
  printings: [
    {
      id: "ST02-015",
      collectorNumber: "ST02-015",
      cardNumber: "ST02-015",
      set: {
        code: "ST02",
        name: "Wings of Advance [ST02]",
        packageId: "616002",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st02/ST02-015.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-015.webp?260424",
      productName: "Wings of Advance [ST02]",
    },
    {
      id: "ST02-015_p1",
      collectorNumber: "ST02-015_p1",
      cardNumber: "ST02-015",
      set: {
        code: "ST02",
        name: "Wings of Advance [ST02] Bonus Pack",
        packageId: "616002",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st02/ST02-015_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-015_p1.webp?260424",
      productName: "Wings of Advance [ST02] Bonus Pack",
    },
    {
      id: "ST02-015_p2",
      collectorNumber: "ST02-015_p2",
      cardNumber: "ST02-015",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/ST02-015_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-015_p2.webp?260424",
      productName: "Edition Beta",
    },
  ],
  selectedPrintingId: "ST02-015_p2",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/ST02-015_p2.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-015_p2.webp?260424",
  legality: "legal",
  level: 2,
  cost: 2,
  hp: 5,
  effect:
    "【Burst】Deploy this card.<br>【Deploy】Add 1 of your Shields to your hand. Then, look at the top 2 cards of your deck and return 1 to the top and 1 to the bottom.<br>",
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
            action: "lookAtTopDeck",
            count: 2,
            return: "topAndBottom",
          },
        },
      ],
      sourceText:
        "【Deploy】Add 1 of your Shields to your hand. Then, look at the top 2 cards of your deck and return 1 to the top and 1 to the bottom.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
