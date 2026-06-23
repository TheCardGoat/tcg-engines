import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailWraithMarauders = {
  id: "67b47cff-2237-4765-86fb-9b2b3abecbb1",
  externalId: "cb-wraith-marauders",
  slug: "wraith-marauders",
  name: "Wraith Marauders",
  displayName: "Wraith Marauders",
  rulesText:
    "When this Unit steals a Gig, ready another friendly Unit with power equal to the Gig's value.",
  color: "green",
  classifications: ["Ganger", "Nomad", "Raffen Shiv"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "092",
  printings: [
    {
      id: "0944037e-5b14-4332-b345-7935924c2125",
      collectorNumber: "092",
      setCode: "welcometonightcityretail",
      rarity: "Uncommon",
    },
    {
      id: "89c5ec5e-dcc1-4ce4-970d-28b0226272b1",
      collectorNumber: "β092",
      setCode: "welcometonightcitybeta",
      rarity: "Uncommon",
    },
  ],
  selectedPrintingId: "0944037e-5b14-4332-b345-7935924c2125",
  artist: "Daniel Valaisis",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/092.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: [],
  keywords: [],
  type: "unit",
  cost: 5,
  power: 4,
  abilities: [
    {
      kind: "triggered",
      text: "When this Unit steals a Gig, ready another friendly Unit with power equal to the Gig's value.",
      trigger: {
        trigger: "event",
        event: {
          event: "gigStolen",
          player: "friendly",
          target: {
            selector: "gig",
            controller: "rival",
          },
          minAmount: 1,
          source: {
            selector: "self",
          },
        },
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "ready",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["field"],
            cardTypes: ["unit"],
            excludeSelf: true,
            powerEqualsGigValueOf: {
              selector: "context",
              key: "triggeredGigs",
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
  reminderText: [],
} satisfies StructuredCardDefinition;
