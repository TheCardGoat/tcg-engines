import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02Qubeley036: UnitCard = {
  cardNumber: "GD02-036",
  name: "Qubeley",
  type: "unit",
  color: "red",
  traits: ["neo zeon"],
  id: "GD02-036",
  externalId: "gundam:gd02-036",
  slug: "qubeley-gd02-036",
  displayName: "Qubeley",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-036",
  printings: [
    {
      id: "GD02-036",
      collectorNumber: "GD02-036",
      cardNumber: "GD02-036",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-036.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-036.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-036_p1",
      collectorNumber: "GD02-036_p1",
      cardNumber: "GD02-036",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-036_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-036_p1.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-036_p2",
      collectorNumber: "GD02-036_p2",
      cardNumber: "GD02-036",
      set: {
        code: "GD02",
        name: "Newtype Challenge 2025 Mission 3",
        packageId: "616901",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-036_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-036_p2.webp?260424",
      productName: "Newtype Challenge 2025 Mission 3",
    },
  ],
  selectedPrintingId: "GD02-036",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-036.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-036.webp?260424",
  legality: "legal",
  level: 7,
  cost: 5,
  ap: 5,
  hp: 5,
  linkCondition: "[Haman Karn]",
  effect:
    "【When Linked】This Unit gains <Suppression> during this turn.\n\r\n(Damage to Shields by an attack is dealt to the first 2 cards simultaneously.)\n【During Pair･(Neo Zeon) Pilot】【Attack】Choose 1 damaged enemy Unit. Deal 2 damage to it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenLinked"],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Suppression",
            duration: "thisTurn",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "【When Linked】This Unit gains <Suppression> during this turn. (Damage to Shields by an attack is dealt to the first 2 cards simultaneously.)",
    },
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        qualification: {
          attribute: "trait",
          comparison: "includes",
          value: "neo zeon",
        },
        conditions: [{ type: "duringPair" }],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 2,
            target: {
              owner: "opponent",
              cardType: "unit",
              state: "damaged",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【During Pair･(Neo Zeon) Pilot】【Attack】Choose 1 damaged enemy Unit. Deal 2 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
