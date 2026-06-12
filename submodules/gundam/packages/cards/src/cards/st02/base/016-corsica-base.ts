import type { BaseCard, CardEffect } from "@tcg/gundam-types";

export const st02CorsicaBase016: BaseCard = {
  cardNumber: "ST02-016",
  name: "Corsica Base",
  type: "base",
  traits: ["oz", "stronghold"],
  id: "ST02-016",
  externalId: "gundam:st02-016",
  slug: "corsica-base-st02-016",
  displayName: "Corsica Base",
  set: { code: "ST02", name: "Wings of Advance [ST02]", packageId: "616002" },
  printNumber: "ST02-016",
  printings: [
    {
      id: "ST02-016",
      collectorNumber: "ST02-016",
      cardNumber: "ST02-016",
      set: {
        code: "ST02",
        name: "Wings of Advance [ST02]",
        packageId: "616002",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st02/ST02-016.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-016.webp?260424",
      productName: "Wings of Advance [ST02]",
    },
    {
      id: "ST02-016_p1",
      collectorNumber: "ST02-016_p1",
      cardNumber: "ST02-016",
      set: {
        code: "ST02",
        name: "Wings of Advance [ST02] Bonus Pack",
        packageId: "616002",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st02/ST02-016_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-016_p1.webp?260424",
      productName: "Wings of Advance [ST02] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST02-016",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st02/ST02-016.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-016.webp?260424",
  legality: "legal",
  level: 3,
  cost: 3,
  hp: 5,
  effect:
    '【Burst】Deploy this card.<br>【Deploy】Add 1 of your Shields to your hand. Then, if it is your turn, deploy 1 [Tallgeese]((OZ)･AP4･HP2) Unit token. If it is your turn and a card with "Corsica Base" in its card name is in your trash, deploy 2 [Leo]((OZ)･AP1･HP1) Unit tokens instead.<br>',
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
          condition: {
            type: "isTurn",
            whose: "friendly",
          },
          thenDirectives: [
            {
              condition: {
                type: "cardInZone",
                owner: "friendly",
                zone: "trash",
                comparison: "gte",
                count: 1,
                hasName: "Corsica Base",
              },
              thenDirectives: [
                {
                  action: {
                    action: "deployToken",
                    token: {
                      name: "Leo",
                      traits: ["oz"],
                      ap: 1,
                      hp: 1,
                      deployState: "active",
                      printedCardNumber: "T-004",
                    },
                    count: 2,
                  },
                },
              ],
              elseDirectives: [
                {
                  action: {
                    action: "deployToken",
                    token: {
                      name: "Tallgeese",
                      traits: ["oz"],
                      ap: 4,
                      hp: 2,
                      deployState: "active",
                      printedCardNumber: "T-005",
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
      sourceText:
        '【Deploy】Add 1 of your Shields to your hand. Then, if it is your turn, deploy 1 [Tallgeese]((OZ)·AP4·HP2) Unit token. If it is your turn and a card with "Corsica Base" in its card name is in your trash, deploy 2 [Leo]((OZ)·AP1·HP1) Unit tokens instead.',
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
