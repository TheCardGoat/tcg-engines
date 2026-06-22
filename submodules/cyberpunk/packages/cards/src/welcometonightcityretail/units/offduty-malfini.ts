import type { WelcomeToNightCityRetailCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailOffdutyMalfini = {
  id: "3ce6b982-7bba-46f1-8832-8867ec3588d4",
  externalId: "cb-offduty-malfini",
  slug: "offduty-malfini",
  name: "Offduty Malfini",
  displayName: "Offduty Malfini",
  rulesText: "{Play} Spend this Unit and a rival Unit.",
  color: "yellow",
  classifications: ["Ganger", "Voodoo Boys"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "051",
  printings: [
    {
      id: "fbefb447-34a3-4d53-9b23-d1bf141f8eec",
      collectorNumber: "051",
      setCode: "welcometonightcityretail",
      rarity: "Common",
    },
    {
      id: "37066158-f899-42c6-abd7-4dcd882a75cd",
      collectorNumber: "β051",
      setCode: "welcometonightcitybeta",
      rarity: "Common",
    },
    {
      id: "1043d9b7-5dae-4fc5-852d-ec31daaaa88d",
      collectorNumber: "004",
      setCode: "theheistretailstarterdeck",
      rarity: "Common",
    },
    {
      id: "e7ef78a6-72d3-42a4-ba98-14facb194eb9",
      collectorNumber: "β004",
      setCode: "theheistbetastarterdeck",
      rarity: "Common",
    },
  ],
  selectedPrintingId: "fbefb447-34a3-4d53-9b23-d1bf141f8eec",
  artist: "Bernard Kowalczuk",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/051.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: [],
  keywords: [],
  type: "unit",
  cost: 4,
  power: 5,
  abilities: [
    {
      kind: "static",
      text: "Play Spend this Unit and a rival Unit.",
      effects: [],
    },
  ],
  reminderText: [],
} satisfies WelcomeToNightCityRetailCardDefinition;
