import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03TierenHighMobilityType078: UnitCard = {
  cardNumber: "GD03-078",
  name: "Tieren High Mobility Type",
  type: "unit",
  color: "white",
  traits: ["superpower bloc"],
  id: "GD03-078",
  externalId: "gundam:gd03-078",
  slug: "tieren-high-mobility-type-gd03-078",
  displayName: "Tieren High Mobility Type",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-078",
  printings: [
    {
      id: "GD03-078",
      collectorNumber: "GD03-078",
      cardNumber: "GD03-078",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-078.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-078.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-078",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-078.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-078.webp?260424",
  legality: "legal",
  level: 2,
  cost: 2,
  ap: 3,
  hp: 1,
  linkCondition: "[Sergei Smirnov]",
  effect: "【During Link】【Destroyed】Return the card paired with this Unit to your hand.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
        conditions: [{ type: "duringLink" }],
      },
      directives: [
        {
          action: {
            action: "returnPairedPilotToHand",
          },
        },
      ],
      sourceText: "【During Link】【Destroyed】Return the card paired with this Unit to your hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
