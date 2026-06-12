import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03GundamFlightForm036: UnitCard = {
  cardNumber: "GD03-036",
  name: "Ξ Gundam (Flight Form)",
  type: "unit",
  color: "red",
  traits: ["mafty"],
  id: "GD03-036",
  externalId: "gundam:gd03-036",
  slug: "gundam-flight-form-gd03-036",
  displayName: "Ξ Gundam (Flight Form)",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-036",
  printings: [
    {
      id: "GD03-036",
      collectorNumber: "GD03-036",
      cardNumber: "GD03-036",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-036.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-036.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-036_p1",
      collectorNumber: "GD03-036_p1",
      cardNumber: "GD03-036",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-036_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-036_p1.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-036",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-036.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-036.webp?260424",
  legality: "legal",
  level: 5,
  cost: 4,
  ap: 4,
  hp: 4,
  linkCondition: "[Hathaway Noa]",
  effect: "【When Linked】Deal 1 damage to all enemy Units.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenLinked"],
      },
      directives: [
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
      sourceText: "【When Linked】Deal 1 damage to all enemy Units.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
