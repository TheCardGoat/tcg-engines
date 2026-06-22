import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const boxTopperRetailJackieWellesPourOneOutForMe = {
  id: "40502c1f-78a2-426a-a706-c60ebd4b31e3",
  externalId: "cb-jackie-welles-pour-one-out-for-me",
  slug: "jackie-welles-pour-one-out-for-me",
  name: "Jackie Welles — Pour One Out For Me",
  displayName: "Jackie Welles — Pour One Out For Me",
  rulesText:
    "The first time you play a Blue Unit or Blue Gear each turn, you may decrease a friendly Gig by up to 2. If it becomes a min Gig, draw 1.",
  color: "blue",
  classifications: ["Merc"],
  set: {
    code: "boxtoppersretail",
    name: "Box Toppers — Retail",
  },
  printNumber: "005",
  printings: [
    {
      id: "e4e17d32-3ec4-4c74-927c-fd0911b86e72",
      collectorNumber: "005",
      setCode: "boxtoppersretail",
      rarity: "Epic",
    },
    {
      id: "a33d3324-fe48-4a9f-80a8-8545a0a4727f",
      collectorNumber: "011",
      setCode: "theheistretailstarterdeck",
      rarity: "Epic",
    },
    {
      id: "328cd3e4-4177-4d6a-86c0-00d1a5a12b38",
      collectorNumber: "β005",
      setCode: "boxtoppersbeta",
      rarity: "Epic",
    },
    {
      id: "a0ef9536-ad3b-47f6-8c2a-171aa3b8b181",
      collectorNumber: "β011",
      setCode: "theheistbetastarterdeck",
      rarity: "Epic",
    },
  ],
  selectedPrintingId: "e4e17d32-3ec4-4c74-927c-fd0911b86e72",
  artist: "Envar Studio",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/boxtoppersretail/005.webp",
  rarity: "Epic",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: [],
  keywords: [],
  type: "legend",
  cost: null,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "The first time you play a Blue Unit or Blue Gear each turn, you may decrease a friendly Gig by up to 2. If it becomes a min Gig, draw 1.",
      trigger: {
        trigger: "event",
        event: {
          event: "cardPlayed",
          player: "friendly",
          target: {
            selector: "card",
            controller: "friendly",
            cardTypes: ["unit", "gear"],
            colors: ["blue"],
          },
        },
      },
      source: {
        selector: "self",
      },
      limits: ["firstTimeEachTurn"],
      bindings: [
        {
          id: "selectedGig",
          target: {
            selector: "gig",
            controller: "friendly",
          },
        },
      ],
      effects: [
        {
          effect: "adjustGig",
          target: {
            selector: "bound",
            id: "selectedGig",
          },
          maxAmount: 2,
          direction: "decrease",
          chooseUpTo: true,
          optional: true,
        },
        {
          effect: "draw",
          player: "friendly",
          amount: 1,
          conditions: [
            {
              condition: "targetValue",
              target: {
                selector: "bound",
                id: "selectedGig",
              },
              property: "gigValue",
              comparison: "eq",
              value: 1,
            },
          ],
        },
      ],
    },
  ],
  reminderText: [],
} satisfies StructuredCardDefinition;
