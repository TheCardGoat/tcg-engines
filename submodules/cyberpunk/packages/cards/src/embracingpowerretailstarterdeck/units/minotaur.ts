import type { EmbracingPowerRetailStarterDeckCardDefinition } from "@tcg/cyberpunk-types";

export const embracingPowerRetailStarterDeckMinotaur = {
  id: "066641c5-acc2-45f4-ba67-16a8d20cce73",
  externalId: "cb-minotaur",
  slug: "minotaur",
  name: "Minotaur",
  displayName: "Minotaur",
  rulesText:
    "[PLAY] If you have more ☆ (Street Cred) than a Rival, defeat a rival Unit with power 5 or less.",
  color: "red",
  classifications: ["Arasaka", "Drone", "Militech"],
  set: {
    code: "embracingpowerretailstarterdeck",
    name: "Embracing Power — Retail Starter Deck",
  },
  printNumber: "003",
  printings: [
    {
      id: "19587d4f-6d47-44fe-b4da-99743e2742f7",
      collectorNumber: "003",
      setCode: "embracingpowerretailstarterdeck",
      rarity: "Uncommon",
    },
    {
      id: "a8dd2d7b-88b8-4b15-b4dd-e3aa3757bb25",
      collectorNumber: "β003",
      setCode: "embracingpowerbetastarterdeck",
      rarity: "Uncommon",
    },
  ],
  selectedPrintingId: "19587d4f-6d47-44fe-b4da-99743e2742f7",
  artist: "CD Projekt Red",
  imageUrl:
    "https://cdn.tcg.online/public/cyberpunk/cards/embracingpowerretailstarterdeck/003.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: ["play"],
  keywords: [],
  type: "unit",
  cost: 7,
  power: 9,
  abilities: [
    {
      kind: "triggered",
      text: "PLAY If you have more ☆ (Street Cred) than a Rival, defeat a rival Unit with power 5 or less.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      conditions: [
        {
          condition: "streetCredComparison",
          controller: "friendly",
          comparison: "gt",
          other: "rival",
        },
      ],
      effects: [
        {
          effect: "defeat",
          target: {
            selector: "card",
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
            maxPower: 5,
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
  reminderText: [],
} satisfies EmbracingPowerRetailStarterDeckCardDefinition;
