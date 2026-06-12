import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01Adzam038: UnitCard = {
  cardNumber: "GD01-038",
  name: "Adzam",
  type: "unit",
  color: "green",
  traits: ["zeon"],
  id: "GD01-038",
  externalId: "gundam:gd01-038",
  slug: "adzam-gd01-038",
  displayName: "Adzam",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-038",
  printings: [
    {
      id: "GD01-038",
      collectorNumber: "GD01-038",
      cardNumber: "GD01-038",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-038.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-038.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-038",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-038.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-038.webp?260424",
  legality: "legal",
  level: 5,
  cost: 4,
  ap: 2,
  hp: 5,
  effect: "【Deploy】If 5 or more enemy Units are in play, deal 1 damage to all enemy Units.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          condition: {
            type: "unitCount",
            owner: "opponent",
            comparison: "gte",
            count: 5,
          },
          thenDirectives: [
            {
              action: {
                action: "dealDamageAll",
                amount: 1,
                target: {
                  owner: "opponent",
                  cardType: "unit",
                },
              },
            },
          ],
        },
      ],
      sourceText:
        "【Deploy】If 5 or more enemy Units are in play, deal 1 damage to all enemy Units.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
