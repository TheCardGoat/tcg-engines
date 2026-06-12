import type { BaseCard, CardEffect } from "@tcg/gundam-types";

export const st01WhiteBase015: BaseCard = {
  cardNumber: "ST01-015",
  name: "White Base",
  type: "base",
  traits: ["earth federation", "white base team", "warship"],
  id: "ST01-015",
  externalId: "gundam:st01-015",
  slug: "white-base-st01-015",
  displayName: "White Base",
  set: { code: "ST01", name: "Heroic Beginnings [ST01]", packageId: "616001" },
  printNumber: "ST01-015",
  printings: [
    {
      id: "ST01-015",
      collectorNumber: "ST01-015",
      cardNumber: "ST01-015",
      set: {
        code: "ST01",
        name: "Heroic Beginnings [ST01]",
        packageId: "616001",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st01/ST01-015.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-015.webp?260424",
      productName: "Heroic Beginnings [ST01]",
    },
    {
      id: "ST01-015_p1",
      collectorNumber: "ST01-015_p1",
      cardNumber: "ST01-015",
      set: {
        code: "ST01",
        name: "Heroic Beginnings [ST01] Bonus Pack",
        packageId: "616001",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st01/ST01-015_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-015_p1.webp?260424",
      productName: "Heroic Beginnings [ST01] Bonus Pack",
    },
    {
      id: "ST01-015_p2",
      collectorNumber: "ST01-015_p2",
      cardNumber: "ST01-015",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/ST01-015_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-015_p2.webp?260424",
      productName: "Edition Beta",
    },
  ],
  selectedPrintingId: "ST01-015",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st01/ST01-015.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-015.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  hp: 5,
  effect:
    "【Burst】Deploy this card.<br>【Deploy】Add 1 of your Shields to your hand.<br>\n【Activate･Main】【Once per Turn】②：Deploy 1 [Gundam]((White Base Team)･AP3･HP3) Unit token if you have no Units in play, deploy 1 [Guncannon]((White Base Team)･AP2･HP2) Unit token if you have only 1 Unit in play, or deploy 1 [Guntank]((White Base Team)･AP1･HP1) Unit token if you have 2 or more Units in play.<br>",
  effects: [
    {
      type: "triggered",
      activation: { timing: ["burst"] },
      directives: [{ action: { action: "deploySelf" } }],
      sourceText: "【Burst】Deploy this card.",
    },
    {
      type: "triggered",
      activation: { timing: ["deploy"] },
      directives: [{ action: { action: "addShieldToHand", count: 1 } }],
      sourceText: "【Deploy】Add 1 of your Shields to your hand.",
    },
    {
      type: "activated",
      activation: {
        timing: ["activate:main"],
        restrictions: [{ type: "oncePerTurn" }],
      },
      cost: { payResources: 2 },
      directives: [
        {
          // if you have 0 Units in play → Gundam token
          condition: { type: "unitCount", owner: "friendly", comparison: "eq", count: 0 },
          thenDirectives: [
            {
              action: {
                action: "deployToken",
                token: {
                  name: "Gundam",
                  traits: ["white base team"],
                  ap: 3,
                  hp: 3,
                  deployState: "active",
                  printedCardNumber: "T-001",
                },
              },
            },
          ],
          elseDirectives: [
            {
              // else if you have exactly 1 Unit → Guncannon token
              condition: { type: "unitCount", owner: "friendly", comparison: "eq", count: 1 },
              thenDirectives: [
                {
                  action: {
                    action: "deployToken",
                    token: {
                      name: "Guncannon",
                      traits: ["white base team"],
                      ap: 2,
                      hp: 2,
                      deployState: "active",
                      printedCardNumber: "T-002",
                    },
                  },
                },
              ],
              elseDirectives: [
                // else (2 or more Units) → Guntank token
                {
                  action: {
                    action: "deployToken",
                    token: {
                      name: "Guntank",
                      traits: ["white base team"],
                      ap: 1,
                      hp: 1,
                      deployState: "active",
                      printedCardNumber: "T-003",
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
      sourceText:
        "【Activate･Main】【Once per Turn】②：Deploy 1 [Gundam]((White Base Team)･AP3･HP3) Unit token if you have no Units in play, deploy 1 [Guncannon]((White Base Team)･AP2･HP2) Unit token if you have only 1 Unit in play, or deploy 1 [Guntank]((White Base Team)･AP1･HP1) Unit token if you have 2 or more Units in play.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
