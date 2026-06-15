import type { WelcomeToNightCityRetailCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailCorpoSecurity = {
  id: "71652e73-984a-4630-be47-af947f87d5c1",
  externalId: "cb-corpo-security",
  slug: "corpo-security",
  name: "Corpo Security",
  displayName: "Corpo Security",
  rulesText:
    "This Unit can't attack.\n{Blocker} (You may spend this Unit to redirect a rival Unit's attack to it instead.)",
  color: "green",
  classifications: ["Corpo"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "076",
  printings: [
    {
      id: "80dcc139-d31d-4b89-86ff-cdbdd2664953",
      collectorNumber: "076",
      setCode: "welcometonightcityretail",
      rarity: "Common",
    },
    {
      id: "19737e35-546d-406f-af5f-2fe6865cdd93",
      collectorNumber: "β076",
      setCode: "welcometonightcitybeta",
      rarity: "Common",
    },
    {
      id: "0ce87466-8869-484f-bd4c-5094fdfc6dbc",
      collectorNumber: "014",
      setCode: "embracingpowerretailstarterdeck",
      rarity: "Common",
    },
    {
      id: "07cad5ea-45c4-404b-99b8-8f53c280a4fb",
      collectorNumber: "β014",
      setCode: "embracingpowerbetastarterdeck",
      rarity: "Common",
    },
  ],
  selectedPrintingId: "80dcc139-d31d-4b89-86ff-cdbdd2664953",
  artist: "CD PROJEKT RED",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/076.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 1,
  timingTriggers: [],
  keywords: ["blocker"],
  type: "unit",
  cost: 2,
  power: 2,
  abilities: [
    {
      kind: "keyword",
      text: "Blocker (You may spend this Unit to redirect a rival Unit's attack to it instead.)",
      keyword: "blocker",
      source: {
        selector: "self",
      },
      effects: [],
    },
    {
      kind: "static",
      text: "This Unit can't attack.",
      effects: [
        {
          effect: "grantRule",
          target: {
            selector: "self",
          },
          rule: "cantAttack",
          duration: "continuous",
        },
      ],
    },
  ],
  reminderText: [],
} satisfies WelcomeToNightCityRetailCardDefinition;
