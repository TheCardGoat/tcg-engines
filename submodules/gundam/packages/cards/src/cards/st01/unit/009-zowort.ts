import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st01Zowort009: UnitCard = {
  cardNumber: "ST01-009",
  name: "Zowort",
  type: "unit",
  color: "white",
  traits: ["academy"],
  id: "ST01-009",
  externalId: "gundam:st01-009",
  slug: "zowort-st01-009",
  displayName: "Zowort",
  set: { code: "ST01", name: "Heroic Beginnings [ST01]", packageId: "616001" },
  printNumber: "ST01-009",
  printings: [
    {
      id: "ST01-009",
      collectorNumber: "ST01-009",
      cardNumber: "ST01-009",
      set: {
        code: "ST01",
        name: "Heroic Beginnings [ST01]",
        packageId: "616001",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st01/ST01-009.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-009.webp?260424",
      productName: "Heroic Beginnings [ST01]",
    },
    {
      id: "ST01-009_p1",
      collectorNumber: "ST01-009_p1",
      cardNumber: "ST01-009",
      set: {
        code: "ST01",
        name: "Heroic Beginnings [ST01] Bonus Pack",
        packageId: "616001",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st01/ST01-009_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-009_p1.webp?260424",
      productName: "Heroic Beginnings [ST01] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST01-009",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st01/ST01-009.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-009.webp?260424",
  legality: "legal",
  level: 2,
  cost: 2,
  ap: 3,
  hp: 2,
  effect:
    "&lt;Blocker&gt; (Rest this Unit to change the attack target to it.)<br>This Unit can't choose the enemy player as its attack target.<br>",
  effects: [
    {
      type: "constant",
      activation: {},
      directives: [
        {
          action: {
            action: "cantTargetPlayer",
            whose: "opponent",
          },
        },
      ],
      sourceText: "This Unit can't choose the enemy player as its attack target.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Blocker" }],
  rarity: "common",
};
