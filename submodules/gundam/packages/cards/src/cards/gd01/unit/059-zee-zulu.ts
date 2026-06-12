import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01ZeeZulu059: UnitCard = {
  cardNumber: "GD01-059",
  name: "Zee Zulu",
  type: "unit",
  color: "red",
  traits: ["neo zeon"],
  id: "GD01-059",
  externalId: "gundam:gd01-059",
  slug: "zee-zulu-gd01-059",
  displayName: "Zee Zulu",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-059",
  printings: [
    {
      id: "GD01-059",
      collectorNumber: "GD01-059",
      cardNumber: "GD01-059",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-059.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-059.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-059",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-059.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-059.webp?260424",
  legality: "legal",
  level: 2,
  cost: 2,
  ap: 2,
  hp: 2,
  effect:
    "【Attack】If you are attacking the enemy player, this Unit gets AP+2 during this battle.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [
          {
            type: "isAttackingPlayer",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 2,
            duration: "thisBattle",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "【Attack】If you are attacking the enemy player, this Unit gets AP+2 during this battle.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
