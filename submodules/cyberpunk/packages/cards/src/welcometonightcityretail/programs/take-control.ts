import type { WelcomeToNightCityRetailCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailTakeControl = {
  id: "1535c19d-54e5-4289-9cb7-15ab429c0092",
  externalId: "cb-take-control",
  slug: "take-control",
  name: "Take Control",
  displayName: "Take Control",
  rulesText:
    "[QUICK] A rival Unit steals 1 fewer Gig this turn. If that Unit is an AI, DRONE, or VEHICLE, draw 1.",
  color: "green",
  classifications: ["Quickhack"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "103",
  printings: [
    {
      id: "bc1401d4-5b9b-495a-853e-0a22a11f6f4c",
      collectorNumber: "103",
      setCode: "welcometonightcityretail",
      rarity: "Uncommon",
    },
    {
      id: "a7a49ccf-4b85-4997-b08c-16e8e80d9aa8",
      collectorNumber: "β103",
      setCode: "welcometonightcitybeta",
      rarity: "Uncommon",
    },
  ],
  selectedPrintingId: "bc1401d4-5b9b-495a-853e-0a22a11f6f4c",
  artist: "RUDCEF",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/103.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: [],
  keywords: ["quick"],
  type: "program",
  cost: 2,
  power: null,
  abilities: [
    {
      kind: "keyword",
      text: "QUICK",
      keyword: "quick",
      source: {
        selector: "self",
      },
      effects: [],
    },
    {
      kind: "triggered",
      text: "A rival Unit steals 1 fewer Gig this turn. If that Unit is an AI, DRONE, or VEHICLE, draw 1.",
      trigger: {
        trigger: "event",
        event: {
          event: "gigStolen",
          player: "rival",
          target: {
            selector: "gig",
            controller: "friendly",
          },
          source: {
            selector: "card",
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
          },
        },
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "draw",
          player: "friendly",
          amount: 1,
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
} satisfies WelcomeToNightCityRetailCardDefinition;
