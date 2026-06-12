import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04SwordImpulseGundam056: UnitCard = {
  cardNumber: "GD04-056",
  name: "Sword Impulse Gundam",
  type: "unit",
  color: "purple",
  traits: ["zaft", "minerva squad"],
  id: "GD04-056",
  externalId: "gundam:gd04-056",
  slug: "sword-impulse-gundam-gd04-056",
  displayName: "Sword Impulse Gundam",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-056",
  printings: [
    {
      id: "GD04-056",
      collectorNumber: "GD04-056",
      cardNumber: "GD04-056",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-056.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-056.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-056",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-056.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-056.webp?260424",
  legality: "legal",
  level: 4,
  cost: 2,
  ap: 3,
  hp: 3,
  linkCondition: "[Shinn Asuka] / [Lunamaria Hawke]",
  effect:
    "【Deploy】Deal 1 damage to this Unit. If you do, choose 1 enemy Unit with 3 or less AP. Rest it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
        {
          action: {
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "ap",
                  comparison: "lte",
                  value: 3,
                },
              ],
              count: 1,
            },
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【Deploy】Deal 1 damage to this Unit. If you do, choose 1 enemy Unit with 3 or less AP. Rest it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
