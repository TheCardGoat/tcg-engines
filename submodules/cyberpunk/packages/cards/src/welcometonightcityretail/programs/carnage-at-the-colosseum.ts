import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailCarnageAtTheColosseum = {
  id: "81fb66ee-b054-4f78-b0c9-7d2c9ff53435",
  externalId: "cb-carnage-at-the-colosseum",
  slug: "carnage-at-the-colosseum",
  name: "Carnage at the Colosseum",
  displayName: "Carnage at the Colosseum",
  rulesText:
    "Play this Program for -1 €$ for each friendly Gig with 8+ value, to a minimum of 1 €$.\nDefeat a rival Unit with less power than a friendly Unit.",
  color: "red",
  classifications: ["Braindance", "Extreme"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "030",
  printings: [
    {
      id: "36128749-4cb1-440d-b4de-4fd463cc2f5c",
      collectorNumber: "030",
      setCode: "welcometonightcityretail",
      rarity: "Common",
    },
    {
      id: "171b21b1-90d0-4d3b-a060-740c413b7bf2",
      collectorNumber: "β030",
      setCode: "welcometonightcitybeta",
      rarity: "Common",
    },
  ],
  selectedPrintingId: "36128749-4cb1-440d-b4de-4fd463cc2f5c",
  artist: "Matías Bergara",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/030.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: true,
  ram: 3,
  timingTriggers: ["play"],
  keywords: [],
  type: "program",
  cost: 6,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "Defeat a rival Unit with less power than a friendly Unit.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "defeat",
          target: {
            selector: "card",
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
            powerLessThanAnyOf: {
              selector: "card",
              controller: "friendly",
              zones: ["field"],
              cardTypes: ["unit"],
            },
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
  costModifier: {
    reducer: "perTargetCount",
    reductionPerCount: 1,
    target: {
      selector: "gig",
      controller: "friendly",
      amount: "all",
      minValue: 8,
    },
    min: 1,
  },
} satisfies StructuredCardDefinition;
