import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const tAdBalloon014: UnitCard = {
  cardNumber: "T-014",
  name: "Ad Balloon",
  type: "unit",
  traits: ["civilian"],
  id: "T-014",
  externalId: "gundam:t-014",
  slug: "ad-balloon-t-014",
  displayName: "Ad Balloon",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "T-014",
  printings: [
    {
      id: "T-014",
      collectorNumber: "T-014",
      cardNumber: "T-014",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/t/T-014.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/T-014.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "T-014",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/t/T-014.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/T-014.webp?260424",
  legality: "legal",
  level: 0,
  cost: 0,
  ap: 0,
  hp: 1,
  effect: "This Unit can't be set as active or paired with a Pilot.",
  effects: [
    {
      type: "constant",
      activation: {},
      directives: [
        {
          action: {
            action: "restrictUnit",
            target: { owner: "self", cardType: "unit", count: 1 },
            restrictions: ["cannotSetActive", "cannotPairPilot"],
          },
        },
      ],
      sourceText: "This Unit can't be set as active or paired with a Pilot.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
export const gd03AdBalloon014 = tAdBalloon014;
