import type { WelcomeToNightCityRetailCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailSketchyRipper = {
  id: "b3b40c68-705b-41ff-ae10-4132497c4a39",
  externalId: "cb-sketchy-ripper",
  slug: "sketchy-ripper",
  name: "Sketchy Ripper",
  displayName: "Sketchy Ripper",
  rulesText:
    "[ATTACK] Search the top 3 cards of your deck. Reveal a Gear and add it to your hand. Bottom-deck the rest.\n(Units with power 0 don't steal Gigs.)",
  color: "yellow",
  classifications: ["Ganger", "Ripperdoc", "Scavenger"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "054",
  printings: [
    {
      id: "12f0398c-bcc3-4944-af72-ac2ae9f36761",
      collectorNumber: "054",
      setCode: "welcometonightcityretail",
      rarity: "Common",
    },
    {
      id: "78b601e2-3dd5-4802-b0e2-5258a4a63363",
      collectorNumber: "β054",
      setCode: "welcometonightcitybeta",
      rarity: "Common",
    },
  ],
  selectedPrintingId: "12f0398c-bcc3-4944-af72-ac2ae9f36761",
  artist: "Michał Dziekan",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/054.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: ["attack"],
  keywords: [],
  type: "unit",
  cost: 2,
  power: 0,
  abilities: [
    {
      kind: "triggered",
      text: "ATTACK Search the top 3 cards of your deck. Reveal a Gear and add it to your hand. Bottom-deck the rest.",
      trigger: {
        trigger: "attack",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "searchDeck",
          player: "friendly",
          lookCount: 3,
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["deck"],
            cardTypes: ["gear"],
            selection: {
              mode: "choose",
              min: 0,
              max: 1,
            },
          },
          select: {
            kind: "upTo",
            max: 1,
          },
          reveal: true,
          destination: "hand",
          remainder: {
            zone: "deckBottom",
          },
        },
      ],
    },
  ],
  reminderText: [],
} satisfies WelcomeToNightCityRetailCardDefinition;
