import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const st01ThoroughlyDamaged012: CommandCard = {
  cardNumber: "ST01-012",
  name: "Thoroughly Damaged",
  type: "command",
  color: "blue",
  traits: ["earth federation", "white base team"],
  id: "ST01-012",
  externalId: "gundam:st01-012",
  slug: "thoroughly-damaged-st01-012",
  displayName: "Thoroughly Damaged",
  set: { code: "ST01", name: "Heroic Beginnings [ST01]", packageId: "616001" },
  printNumber: "ST01-012",
  printings: [
    {
      id: "ST01-012",
      collectorNumber: "ST01-012",
      cardNumber: "ST01-012",
      set: {
        code: "ST01",
        name: "Heroic Beginnings [ST01]",
        packageId: "616001",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st01/ST01-012.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-012.webp?260424",
      productName: "Heroic Beginnings [ST01]",
    },
    {
      id: "ST01-012_p1",
      collectorNumber: "ST01-012_p1",
      cardNumber: "ST01-012",
      set: {
        code: "ST01",
        name: "Heroic Beginnings [ST01] Bonus Pack",
        packageId: "616001",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st01/ST01-012_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-012_p1.webp?260424",
      productName: "Heroic Beginnings [ST01] Bonus Pack",
    },
    {
      id: "ST01-012_p2",
      collectorNumber: "ST01-012_p2",
      cardNumber: "ST01-012",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/ST01-012_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-012_p2.webp?260424",
      productName: "Edition Beta",
    },
  ],
  selectedPrintingId: "ST01-012",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st01/ST01-012.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-012.webp?260424",
  legality: "legal",
  level: 2,
  cost: 1,
  pilotName: "Hayato Kobayashi",
  apBonus: 0,
  hpBonus: 1,
  effect:
    "【Main】Choose 1 rested enemy Unit. Deal 1 damage to it.<br>【Pilot】[Hayato Kobayashi]<br>",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "opponent",
              cardType: "unit",
              state: "rested",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Main】Choose 1 rested enemy Unit. Deal 1 damage to it. 【Pilot】[Hayato Kobayashi]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
