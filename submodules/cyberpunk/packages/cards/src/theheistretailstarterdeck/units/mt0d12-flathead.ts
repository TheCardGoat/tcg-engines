import type { TheHeistRetailStarterDeckCardDefinition } from "@tcg/cyberpunk-types";

export const theHeistRetailStarterDeckMt0d12Flathead = {
  id: "619429c9-132f-496e-8aa0-414e850c87ec",
  externalId: "cb-mt0d12-flathead",
  slug: "mt0d12-flathead",
  name: "MT0D12 Flathead",
  displayName: "MT0D12 Flathead",
  rulesText: "If you have less ☆ (Street Cred) than a Rival, this Unit can't be blocked.",
  color: "blue",
  classifications: ["Drone", "Militech"],
  set: {
    code: "theheistretailstarterdeck",
    name: "The Heist — Retail Starter Deck",
  },
  printNumber: "015",
  printings: [
    {
      id: "5f0d9dac-2547-4ecb-896e-0c603968422a",
      collectorNumber: "015",
      setCode: "theheistretailstarterdeck",
      rarity: "Uncommon",
    },
    {
      id: "d4a627d7-2ea9-4080-9f54-435a7d77fb27",
      collectorNumber: "β015",
      setCode: "theheistbetastarterdeck",
      rarity: "Uncommon",
    },
  ],
  selectedPrintingId: "5f0d9dac-2547-4ecb-896e-0c603968422a",
  artist: "Federico Sabbatini",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/theheistretailstarterdeck/015.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: true,
  ram: 3,
  timingTriggers: [],
  keywords: [],
  type: "unit",
  cost: 5,
  power: 7,
  abilities: [
    {
      kind: "static",
      text: "If you have less ☆ (Street Cred) than a Rival, this Unit can't be blocked.",
      effects: [],
    },
  ],
  reminderText: [],
} satisfies TheHeistRetailStarterDeckCardDefinition;
