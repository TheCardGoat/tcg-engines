import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02CalamityGundam009: UnitCard = {
  cardNumber: "GD02-009",
  name: "Calamity Gundam",
  type: "unit",
  color: "blue",
  traits: ["earth alliance"],
  id: "GD02-009",
  externalId: "gundam:gd02-009",
  slug: "calamity-gundam-gd02-009",
  displayName: "Calamity Gundam",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-009",
  printings: [
    {
      id: "GD02-009",
      collectorNumber: "GD02-009",
      cardNumber: "GD02-009",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-009.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-009.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-009",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-009.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-009.webp?260424",
  legality: "legal",
  level: 5,
  cost: 3,
  ap: 3,
  hp: 5,
  effect:
    "【Once per Turn】When this Unit's AP is reduced by an enemy effect, choose 1 rested enemy Unit. Deal 2 damage to it.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["onApReducedByEnemy"],
        restrictions: [{ type: "oncePerTurn" }],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 2,
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
        "【Once per Turn】When this Unit's AP is reduced by an enemy effect, choose 1 rested enemy Unit. Deal 2 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
