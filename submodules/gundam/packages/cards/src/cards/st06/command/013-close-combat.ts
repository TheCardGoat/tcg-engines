import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const st06CloseCombat013: CommandCard = {
  cardNumber: "ST03-013-p3",
  name: "Close Combat",
  type: "command",
  color: "red",
  traits: ["-"],
  id: "ST03-013_p3",
  externalId: "gundam:st03-013_p3",
  slug: "close-combat-st03-013-p3",
  displayName: "Close Combat",
  set: { code: "ST06", name: "Clan Unity [ST06]", packageId: "616006" },
  printNumber: "ST03-013_p3",
  printings: [
    {
      id: "ST03-013",
      collectorNumber: "ST03-013",
      cardNumber: "ST03-013",
      set: {
        code: "ST03",
        name: "Zeon's Rush [ST03]",
        packageId: "616003",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st03/ST03-013.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-013.webp?260424",
      productName: "Zeon's Rush [ST03]",
    },
    {
      id: "ST03-013_p1",
      collectorNumber: "ST03-013_p1",
      cardNumber: "ST03-013",
      set: {
        code: "ST03",
        name: "Zeon's Rush [ST03] Bonus Pack",
        packageId: "616003",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st03/ST03-013_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-013_p1.webp?260424",
      productName: "Zeon's Rush [ST03] Bonus Pack",
    },
    {
      id: "ST03-013_p2",
      collectorNumber: "ST03-013_p2",
      cardNumber: "ST03-013",
      set: {
        code: "ST03",
        name: "Championship Participation Pack 01",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st03/ST03-013_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-013_p2.webp?260424",
      productName: "Championship Participation Pack 01",
    },
    {
      id: "ST03-013_p3",
      collectorNumber: "ST03-013_p3",
      cardNumber: "ST03-013",
      set: {
        code: "ST06",
        name: "Clan Unity [ST06]",
        packageId: "616006",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st03/ST03-013_p3.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-013_p3.webp?260424",
      productName: "Clan Unity [ST06]",
    },
    {
      id: "ST03-013_p4",
      collectorNumber: "ST03-013_p4",
      cardNumber: "ST03-013",
      set: {
        code: "ST06",
        name: "Clan Unity [ST06] Bonus Pack",
        packageId: "616006",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st03/ST03-013_p4.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-013_p4.webp?260424",
      productName: "Clan Unity [ST06] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST03-013_p3",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st03/ST03-013_p3.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-013_p3.webp?260424",
  legality: "legal",
  level: 2,
  cost: 2,
  effect:
    "【Burst】Activate this card's 【Main】.<br>【Main】/【Action】Choose 1 enemy Unit. Deal 2 damage to it.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "activateTiming",
            timing: "main",
          },
        },
      ],
      sourceText: "【Burst】Activate this card's 【Main】.",
    },
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 2,
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Main】/【Action】Choose 1 enemy Unit. Deal 2 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
