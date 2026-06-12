import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01DeltaPlus006: UnitCard = {
  cardNumber: "GD01-006",
  name: "Delta Plus",
  type: "unit",
  color: "blue",
  traits: ["earth federation"],
  id: "GD01-006",
  externalId: "gundam:gd01-006",
  slug: "delta-plus-gd01-006",
  displayName: "Delta Plus",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-006",
  printings: [
    {
      id: "GD01-006",
      collectorNumber: "GD01-006",
      cardNumber: "GD01-006",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-006.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-006.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-006_p1",
      collectorNumber: "GD01-006_p1",
      cardNumber: "GD01-006",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-006_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-006_p1.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-006",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-006.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-006.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 4,
  hp: 3,
  linkCondition: "[Riddhe Marcenas]",
  effect:
    "&lt;Repair 1&gt; (At the end of your turn, this Unit recovers the specified number of HP.)<br>【During Link】This Unit gets HP+1.<br>",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [{ type: "duringLink" }],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "hp",
            amount: 1,
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText: "【During Link】This Unit gets HP+1.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Repair", value: 1 }],
  rarity: "rare",
};
