import type { WelcomeToNightCityRetailCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailTBugAmateurPhilosopher = {
  id: "5a5a177c-6ed8-4bd9-8b11-13c2b64414e2",
  externalId: "cb-t-bug-amateur-philosopher",
  slug: "t-bug-amateur-philosopher",
  name: "T-Bug — Amateur Philosopher",
  displayName: "T-Bug — Amateur Philosopher",
  rulesText:
    "{Defeated} Look at all friendly face-down Legends. Then, you may Call a Legend for free. (You can only Call a Legend once per turn.)",
  color: "yellow",
  classifications: ["Merc", "Netrunner"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "055",
  printings: [
    {
      id: "e2e3d98d-0159-4a79-b543-e37264f23118",
      collectorNumber: "055",
      setCode: "welcometonightcityretail",
      rarity: "Uncommon",
    },
    {
      id: "f3ca6b06-28da-42be-8526-743f22dc56b3",
      collectorNumber: "β055",
      setCode: "welcometonightcitybeta",
      rarity: "Uncommon",
    },
    {
      id: "46ddb436-ea2f-4c7f-b9b4-7987835c9cce",
      collectorNumber: "006",
      setCode: "theheistretailstarterdeck",
      rarity: "Uncommon",
    },
    {
      id: "646dde1d-a112-4c7b-aecc-f63e130d4df0",
      collectorNumber: "β006",
      setCode: "theheistbetastarterdeck",
      rarity: "Uncommon",
    },
  ],
  selectedPrintingId: "e2e3d98d-0159-4a79-b543-e37264f23118",
  artist: "Łukasz Poller",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/055.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: [],
  keywords: [],
  type: "unit",
  cost: 4,
  power: 4,
  abilities: [
    {
      kind: "static",
      text: "Defeated Look at all friendly face-down Legends. Then, you may Call a Legend for free.",
      effects: [],
    },
  ],
  reminderText: ["You can only Call a Legend once per turn."],
} satisfies WelcomeToNightCityRetailCardDefinition;
