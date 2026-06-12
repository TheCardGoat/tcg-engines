import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01GearaZuluGuardsType052: UnitCard = {
  cardNumber: "GD01-052",
  name: "Geara Zulu (Guards Type)",
  type: "unit",
  color: "red",
  traits: ["neo zeon"],
  id: "GD01-052",
  externalId: "gundam:gd01-052",
  slug: "geara-zulu-guards-type-gd01-052",
  displayName: "Geara Zulu (Guards Type)",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-052",
  printings: [
    {
      id: "GD01-052",
      collectorNumber: "GD01-052",
      cardNumber: "GD01-052",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-052.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-052.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-052",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-052.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-052.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 2,
  hp: 4,
  effect: "【Deploy】Choose 1 enemy Unit. Deal 1 damage to it.<br>",
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
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Deploy】Choose 1 enemy Unit. Deal 1 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
