import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st03Sinanju001: UnitCard = {
  cardNumber: "ST03-001",
  name: "Sinanju",
  type: "unit",
  color: "red",
  traits: ["neo zeon"],
  id: "ST03-001",
  externalId: "gundam:st03-001",
  slug: "sinanju-st03-001",
  displayName: "Sinanju",
  set: { code: "ST03", name: "Zeon's Rush [ST03]", packageId: "616003" },
  printNumber: "ST03-001",
  printings: [
    {
      id: "ST03-001",
      collectorNumber: "ST03-001",
      cardNumber: "ST03-001",
      set: {
        code: "ST03",
        name: "Zeon's Rush [ST03]",
        packageId: "616003",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st03/ST03-001.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-001.webp?260424",
      productName: "Zeon's Rush [ST03]",
    },
    {
      id: "ST03-001_p1",
      collectorNumber: "ST03-001_p1",
      cardNumber: "ST03-001",
      set: {
        code: "ST03",
        name: "Zeon's Rush [ST03] Bonus Pack",
        packageId: "616003",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st03/ST03-001_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-001_p1.webp?260424",
      productName: "Zeon's Rush [ST03] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST03-001",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st03/ST03-001.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-001.webp?260424",
  legality: "legal",
  level: 6,
  cost: 5,
  ap: 5,
  hp: 4,
  linkCondition: "[Full Frontal]",
  effect:
    "【During Pair】This Unit gains <High-Maneuver>.\n\r\n(This Unit can't be blocked.)\nDuring your turn, when this Unit destroys an enemy shield area card with battle damage, choose 1 enemy Unit. Deal 2 damage to it.",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [{ type: "duringPair" }],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "HighManeuver",
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText: "【During Pair】This Unit gains <High-Maneuver>. (This Unit can't be blocked.)",
    },
    {
      type: "triggered",
      activation: {
        timing: ["onShieldAreaCardDestroyByBattle"],
        conditions: [{ type: "isTurn", whose: "friendly" }, { type: "eventCardIsSelf" }],
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
      sourceText:
        "During your turn, when this Unit destroys an enemy shield area card with battle damage, choose 1 enemy Unit. Deal 2 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
