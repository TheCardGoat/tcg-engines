import type { SpoilerCardDefinition } from "@tcg/cyberpunk-types";

export const spoilerVStreetkid = {
  id: "1504a3cc-26ea-4415-8973-35fa6f14a7b8",
  externalId: "cyberpunk:v-streetkid",
  slug: "v-streetkid",
  name: "V",
  subname: "Streetkid",
  displayName: "V - Streetkid",
  rulesText:
    "GO SOLO DEFEATED Discard the top 3 cards of your deck. Then, choose 1 Braindance Program from your trash and add it to your hand.",
  color: "red",
  classifications: ["Merc"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "132a",
  printings: [
    {
      id: "07bc3b1c-9d25-4121-8d9f-eef284d4ed16",
      collectorNumber: "132a",
      setCode: "spoiler",
      rarity: null,
    },
    {
      id: "b1a7082e-5b13-4731-8a90-f1b7c1b8894f",
      collectorNumber: "132b",
      setCode: "spoiler",
      rarity: null,
    },
  ],
  selectedPrintingId: "07bc3b1c-9d25-4121-8d9f-eef284d4ed16",
  artist: "Pandart Studio",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/spoiler/132a.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: [],
  keywords: ["goSolo"],
  type: "legend",
  cost: 4,
  power: 3,
  abilities: [
    {
      kind: "keyword",
      text: "GO SOLO",
      keyword: "goSolo",
      source: {
        selector: "self",
      },
      effects: [],
    },
    {
      kind: "triggered",
      text: "DEFEATED Discard the top 3 cards of your deck. Then, choose 1 Braindance Program from your trash and add it to your hand.",
      trigger: {
        trigger: "defeated",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "trashFromDeck",
          player: "friendly",
          amount: 3,
        },
        {
          effect: "moveCard",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["trash"],
            cardTypes: ["program"],
            classifications: ["Braindance"],
          },
          destination: "hand",
        },
      ],
    },
  ],
  reminderText: [],
} satisfies SpoilerCardDefinition;
