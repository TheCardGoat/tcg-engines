import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailEvelynParkerBeautifulEnigma = {
  id: "55807eb7-8a8e-44a9-97a2-c8ac993e7b43",
  externalId: "cb-evelyn-parker-beautiful-enigma",
  slug: "evelyn-parker-beautiful-enigma",
  name: "Evelyn Parker — Beautiful Enigma",
  displayName: "Evelyn Parker — Beautiful Enigma",
  rulesText:
    "When a friendly CORPO or GANGER Unit steals 1 or more Gigs, ready 1 Eddie.\n1 €$, [Spend Icon:] A rival Unit must attack next turn if it can.",
  color: "blue",
  classifications: ["Doll"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "107",
  printings: [
    {
      id: "ba766c1d-d929-4a22-bc91-7400784536c8",
      collectorNumber: "107",
      setCode: "welcometonightcityretail",
      rarity: "Rare",
    },
    {
      id: "080b22ac-9c3d-48ee-ad4f-4e9579f22adc",
      collectorNumber: "β107",
      setCode: "welcometonightcitybeta",
      rarity: "Rare",
    },
  ],
  selectedPrintingId: "ba766c1d-d929-4a22-bc91-7400784536c8",
  artist: "Daniel Valaisis",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/107.webp",
  rarity: "Rare",
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
      text: "When a friendly CORPO or GANGER Unit steals 1 or more Gigs, ready 1 Eddie.",
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
        },
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "readyEddies",
          player: "friendly",
          amount: 1,
        },
      ],
    },
    {
      kind: "triggered",
      text: "1 €$, SPEND A rival Unit must attack next turn if it can.",
      trigger: {
        trigger: "activated",
      },
      source: {
        selector: "self",
      },
      bindings: [
        {
          id: "selectedUnit",
          target: {
            selector: "card",
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
        },
      ],
      costs: [
        {
          cost: "payEddies",
          amount: 1,
        },
        {
          cost: "spend",
          target: {
            selector: "self",
          },
        },
      ],
      effects: [
        {
          effect: "grantRule",
          target: {
            selector: "bound",
            id: "selectedUnit",
          },
          rule: "mustAttack",
          duration: "untilSourceNextTurn",
        },
      ],
    },
  ],
  reminderText: [],
} satisfies StructuredCardDefinition;
