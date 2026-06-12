import type { BaseCard, CardEffect } from "@tcg/gundam-types";

export const st01AsticassiaSchoolOfTechnologyEarthHouse016: BaseCard = {
  cardNumber: "ST01-016",
  name: "Asticassia School of Technology, Earth House",
  type: "base",
  traits: ["academy", "stronghold"],
  id: "ST01-016",
  externalId: "gundam:st01-016",
  slug: "asticassia-school-of-technology-earth-house-st01-016",
  displayName: "Asticassia School of Technology, Earth House",
  set: { code: "ST01", name: "Heroic Beginnings [ST01]", packageId: "616001" },
  printNumber: "ST01-016",
  printings: [
    {
      id: "ST01-016",
      collectorNumber: "ST01-016",
      cardNumber: "ST01-016",
      set: {
        code: "ST01",
        name: "Heroic Beginnings [ST01]",
        packageId: "616001",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st01/ST01-016.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-016.webp?260424",
      productName: "Heroic Beginnings [ST01]",
    },
    {
      id: "ST01-016_p1",
      collectorNumber: "ST01-016_p1",
      cardNumber: "ST01-016",
      set: {
        code: "ST01",
        name: "Heroic Beginnings [ST01] Bonus Pack",
        packageId: "616001",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st01/ST01-016_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-016_p1.webp?260424",
      productName: "Heroic Beginnings [ST01] Bonus Pack",
    },
    {
      id: "ST01-016_p2",
      collectorNumber: "ST01-016_p2",
      cardNumber: "ST01-016",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/ST01-016_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-016_p2.webp?260424",
      productName: "Edition Beta",
    },
  ],
  selectedPrintingId: "ST01-016",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st01/ST01-016.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-016.webp?260424",
  legality: "legal",
  level: 2,
  cost: 1,
  hp: 5,
  effect:
    "【Burst】Deploy this card.<br>【Deploy】Add 1 of your Shields to your hand.<br>\n【Activate･Main】Rest this Base：All friendly Link Units get AP+1 during this turn.<br>",
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
      activation: { timing: ["activate:main"] },
      cost: { restSelf: true },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 1,
            duration: "thisTurn",
            target: { owner: "friendly", cardType: "unit", isLinkUnit: true },
          },
        },
      ],
      sourceText:
        "【Activate･Main】Rest this Base：All friendly Link Units get AP+1 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
