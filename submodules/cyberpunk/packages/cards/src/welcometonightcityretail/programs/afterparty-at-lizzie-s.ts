import type { WelcomeToNightCityRetailCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailAfterpartyAtLizzieS = {
  id: "d039e4b3-9b83-40da-8d8f-b1dfb1f172f1",
  externalId: "cb-afterparty-at-lizzie-s",
  slug: "afterparty-at-lizzie-s",
  name: "Afterparty at Lizzie's",
  displayName: "Afterparty at Lizzie's",
  rulesText:
    "Adjust a Gig by up to 1. If you control 2 or more Gigs with different values, draw 1.",
  color: "yellow",
  classifications: ["Braindance", "Mox"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "065",
  printings: [
    {
      id: "d53925ee-df55-4b71-8ca0-13ec3ede2076",
      collectorNumber: "065",
      setCode: "welcometonightcityretail",
      rarity: "Common",
    },
    {
      id: "5adb7a6a-de7b-4f00-9d5a-2cccfaf4f19d",
      collectorNumber: "β065",
      setCode: "welcometonightcitybeta",
      rarity: "Common",
    },
    {
      id: "17db8555-a470-4c5b-9a24-4fac4bf04c4c",
      collectorNumber: "010",
      setCode: "theheistretailstarterdeck",
      rarity: "Common",
    },
    {
      id: "a8dcad7d-7b45-427d-8123-3140b30ac612",
      collectorNumber: "β010",
      setCode: "theheistbetastarterdeck",
      rarity: "Common",
    },
  ],
  selectedPrintingId: "d53925ee-df55-4b71-8ca0-13ec3ede2076",
  artist: "Alicja Użarowska",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/065.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: true,
  ram: 1,
  timingTriggers: [],
  keywords: [],
  type: "program",
  cost: 1,
  power: null,
  abilities: [
    {
      kind: "static",
      text: "Adjust a Gig by up to 1. If you control 2 or more Gigs with different values, draw 1.",
      effects: [],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
} satisfies WelcomeToNightCityRetailCardDefinition;
