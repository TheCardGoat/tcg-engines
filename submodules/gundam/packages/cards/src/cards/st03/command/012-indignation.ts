import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const st03Indignation012: CommandCard = {
  cardNumber: "ST03-012",
  name: "Indignation",
  type: "command",
  color: "red",
  traits: ["neo zeon"],
  id: "ST03-012",
  externalId: "gundam:st03-012",
  slug: "indignation-st03-012",
  displayName: "Indignation",
  set: { code: "ST03", name: "Zeon's Rush [ST03]", packageId: "616003" },
  printNumber: "ST03-012",
  printings: [
    {
      id: "ST03-012",
      collectorNumber: "ST03-012",
      cardNumber: "ST03-012",
      set: {
        code: "ST03",
        name: "Zeon's Rush [ST03]",
        packageId: "616003",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st03/ST03-012.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-012.webp?260424",
      productName: "Zeon's Rush [ST03]",
    },
    {
      id: "ST03-012_p1",
      collectorNumber: "ST03-012_p1",
      cardNumber: "ST03-012",
      set: {
        code: "ST03",
        name: "Zeon's Rush [ST03] Bonus Pack",
        packageId: "616003",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st03/ST03-012_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-012_p1.webp?260424",
      productName: "Zeon's Rush [ST03] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST03-012",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st03/ST03-012.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-012.webp?260424",
  legality: "legal",
  level: 2,
  cost: 1,
  pilotName: "Angelo Sauper",
  apBonus: 1,
  hpBonus: 0,
  effect:
    "【Main】/【Action】Choose 1 friendly Unit. It gets AP+2 during this turn.<br>【Pilot】[Angelo Sauper]<br>",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
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
        "【Main】/【Action】Choose 1 friendly Unit. It gets AP+2 during this turn. 【Pilot】[Angelo Sauper]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
