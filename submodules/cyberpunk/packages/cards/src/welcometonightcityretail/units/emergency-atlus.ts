import type { WelcomeToNightCityRetailCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailEmergencyAtlus = {
  id: "917e6515-ed23-4a1d-baaa-474d879bdabc",
  externalId: "cb-emergency-atlus",
  slug: "emergency-atlus",
  name: "Emergency Atlus",
  displayName: "Emergency Atlus",
  rulesText: '"Grab the policyholder, leave the rest for the city meatwagon."',
  color: "green",
  classifications: ["Trauma Team", "Vehicle", "Zetatech"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "077",
  printings: [
    {
      id: "9c18b6ae-765d-4244-8de4-e382c4767de1",
      collectorNumber: "077",
      setCode: "welcometonightcityretail",
      rarity: "Common",
    },
    {
      id: "b4a1d2af-4ee4-4ec4-8a5b-eaec9cb3211a",
      collectorNumber: "β077",
      setCode: "welcometonightcitybeta",
      rarity: "Common",
    },
    {
      id: "b00202eb-35e5-4ae7-8079-34b70a143040",
      collectorNumber: "015",
      setCode: "embracingpowerretailstarterdeck",
      rarity: "Common",
    },
    {
      id: "0a5892de-42fa-4001-b48a-2c294251dad8",
      collectorNumber: "β015",
      setCode: "embracingpowerbetastarterdeck",
      rarity: "Common",
    },
  ],
  selectedPrintingId: "9c18b6ae-765d-4244-8de4-e382c4767de1",
  artist: "Robert Sammelin",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/077.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 1,
  timingTriggers: [],
  keywords: [],
  type: "unit",
  cost: 3,
  power: 4,
  abilities: [
    {
      kind: "static",
      text: '"Grab the policyholder, leave the rest for the city meatwagon."',
      effects: [],
    },
  ],
  reminderText: [],
} satisfies WelcomeToNightCityRetailCardDefinition;
