import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const tWireGuidedArm022: UnitCard = {
  cardNumber: "T-022",
  name: "Wire-Guided Arm",
  type: "unit",
  traits: ["zeon"],
  id: "T-022",
  externalId: "gundam:t-022",
  slug: "wire-guided-arm-t-022",
  displayName: "Wire-Guided Arm",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "T-022",
  printings: [
    {
      id: "T-022",
      collectorNumber: "T-022",
      cardNumber: "T-022",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/t/T-022.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/T-022.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "T-022",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/t/T-022.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/T-022.webp?260424",
  legality: "legal",
  level: 0,
  cost: 0,
  ap: 2,
  hp: 1,
  effect: "This Unit can't be paired with a Pilot.",
  effects: [
    {
      type: "constant",
      activation: {},
      directives: [
        {
          action: {
            action: "restrictUnit",
            target: { owner: "self", cardType: "unit", count: 1 },
            restrictions: ["cannotPairPilot"],
          },
        },
      ],
      sourceText: "This Unit can't be paired with a Pilot.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
export const gd04WireGuidedArm022 = tWireGuidedArm022;
