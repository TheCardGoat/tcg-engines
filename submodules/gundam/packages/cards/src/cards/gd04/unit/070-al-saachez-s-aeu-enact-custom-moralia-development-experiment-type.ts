import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04AlSaachezSAeuEnactCustomMoraliaDevelopmentExperimentType070: UnitCard = {
  cardNumber: "GD04-070",
  name: "Al-Saachez's AEU Enact Custom Moralia Development Experiment Type",
  type: "unit",
  color: "white",
  traits: ["superpower bloc"],
  id: "GD04-070",
  externalId: "gundam:gd04-070",
  slug: "al-saachez-s-aeu-enact-custom-moralia-development-experiment-type-gd04-070",
  displayName: "Al-Saachez's AEU Enact Custom Moralia Development Experiment Type",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-070",
  printings: [
    {
      id: "GD04-070",
      collectorNumber: "GD04-070",
      cardNumber: "GD04-070",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-070.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-070.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-070",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-070.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-070.webp?260424",
  legality: "legal",
  level: 2,
  cost: 2,
  ap: 3,
  hp: 1,
  linkCondition: "[Ali al-Saachez]",
  effect:
    '【Deploy】You may pair 1 Pilot card with "Ali al-Saachez" in its card name from your hand with this Unit.',
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "pairPilot",
            target: {
              owner: "friendly",
              cardType: "pilot",
              zone: "hand",
              count: 1,
              attributeFilters: [
                {
                  attribute: "name",
                  comparison: "includes",
                  value: "Ali al-Saachez",
                },
              ],
            },
          },
          optional: true,
        },
      ],
      sourceText:
        '【Deploy】You may pair 1 Pilot card with "Ali al-Saachez" in its card name from your hand with this Unit.',
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
