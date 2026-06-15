import type { WelcomeToNightCityRetailCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailEvelynParkerSchemingSiren = {
  id: "a3cc3d15-8e6a-4684-b2ca-c843b4a854e2",
  externalId: "cb-evelyn-parker-scheming-siren",
  slug: "evelyn-parker-scheming-siren",
  name: "Evelyn Parker — Scheming Siren",
  displayName: "Evelyn Parker — Scheming Siren",
  rulesText:
    "{Attack} Draw 1. Then, if you have more ☆ (Street Cred) than a Rival, discard 1.\n(Units with power 0 don't steal Gigs.)",
  color: "blue",
  classifications: ["Doll"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "113",
  printings: [
    {
      id: "7d174619-2183-4058-a89a-082c6b7b5a5c",
      collectorNumber: "113",
      setCode: "welcometonightcityretail",
      rarity: "Uncommon",
    },
    {
      id: "c40f0461-c757-4e09-94cc-27ed31f08dd7",
      collectorNumber: "β113",
      setCode: "welcometonightcitybeta",
      rarity: "Uncommon",
    },
    {
      id: "4b037f20-0cb8-4dfa-bd34-3a3b8381632b",
      collectorNumber: "014",
      setCode: "theheistretailstarterdeck",
      rarity: "Uncommon",
    },
    {
      id: "c7bc2b37-c1a4-43aa-a4c3-5dd60514b098",
      collectorNumber: "β014",
      setCode: "theheistbetastarterdeck",
      rarity: "Uncommon",
    },
  ],
  selectedPrintingId: "7d174619-2183-4058-a89a-082c6b7b5a5c",
  artist: "Olgierd Ciszak",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/113.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: false,
  ram: 3,
  timingTriggers: [],
  keywords: [],
  type: "unit",
  cost: 2,
  power: 0,
  abilities: [
    {
      kind: "static",
      text: "Attack Draw 1. Then, if you have more ☆ (Street Cred) than a Rival, discard 1. (Units with power 0 don't steal Gigs.)",
      effects: [],
    },
  ],
  reminderText: [],
} satisfies WelcomeToNightCityRetailCardDefinition;
