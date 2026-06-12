import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02RaiderGundam010: UnitCard = {
  cardNumber: "GD02-010",
  name: "Raider Gundam",
  type: "unit",
  color: "blue",
  traits: ["earth alliance"],
  id: "GD02-010",
  externalId: "gundam:gd02-010",
  slug: "raider-gundam-gd02-010",
  displayName: "Raider Gundam",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-010",
  printings: [
    {
      id: "GD02-010",
      collectorNumber: "GD02-010",
      cardNumber: "GD02-010",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-010.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-010.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-010",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-010.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-010.webp?260424",
  legality: "legal",
  level: 5,
  cost: 3,
  ap: 4,
  hp: 4,
  effect: "【Once per Turn】When this Unit receives enemy effect damage, draw 1.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["onEnemyEffectDamage"],
        restrictions: [{ type: "oncePerTurn" }],
      },
      directives: [
        {
          action: {
            action: "draw",
            count: 1,
          },
        },
      ],
      sourceText: "【Once per Turn】When this Unit receives enemy effect damage, draw 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
