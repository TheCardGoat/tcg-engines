import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailPeaceOffering = {
  id: "3b30f02d-84dd-402c-ab4b-87a2ec3badce",
  externalId: "cb-peace-offering",
  slug: "peace-offering",
  name: "Peace Offering",
  displayName: "Peace Offering",
  rulesText:
    "You may set a Gig's value to the value of another Gig. Then, if you control a value-pair, draw 1.",
  color: "green",
  classifications: ["Braindance"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "101",
  printings: [
    {
      id: "8570122a-52aa-4a6b-8d72-4c8848df0f9b",
      collectorNumber: "101",
      setCode: "welcometonightcityretail",
      rarity: "Common",
    },
    {
      id: "2cff513f-6a75-40f0-8e70-e1491d340472",
      collectorNumber: "β101",
      setCode: "welcometonightcitybeta",
      rarity: "Common",
    },
  ],
  selectedPrintingId: "8570122a-52aa-4a6b-8d72-4c8848df0f9b",
  artist: "Mattia De Iulis",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/101.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: true,
  ram: 1,
  timingTriggers: ["play"],
  keywords: [],
  type: "program",
  cost: 1,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "You may set a Gig's value to the value of another Gig. Then, if you control a value-pair, draw 1.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      bindings: [
        {
          id: "selectedGigs",
          target: {
            selector: "gig",
            amount: 2,
            selection: {
              mode: "choose",
              min: 2,
              max: 2,
            },
          },
        },
      ],
      effects: [
        {
          effect: "copyGigValue",
          source: {
            selector: "bound",
            id: "selectedGigs",
            index: 0,
          },
          target: {
            selector: "bound",
            id: "selectedGigs",
            index: 1,
          },
          optional: true,
        },
        {
          effect: "draw",
          player: "friendly",
          amount: 1,
          conditions: [
            {
              condition: "hasGigPair",
              controller: "friendly",
            },
          ],
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
} satisfies StructuredCardDefinition;
