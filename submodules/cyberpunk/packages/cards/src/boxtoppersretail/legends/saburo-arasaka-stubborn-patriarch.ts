import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const boxTopperRetailSaburoArasakaStubbornPatriarch = {
  id: "cf50fa24-bf94-4c35-bcc1-c6d56a6f68d8",
  externalId: "cb-saburo-arasaka-stubborn-patriarch",
  slug: "saburo-arasaka-stubborn-patriarch",
  name: "Saburo Arasaka — Stubborn Patriarch",
  displayName: "Saburo Arasaka — Stubborn Patriarch",
  rulesText:
    "Friendly ARASAKA Units have +1 power while attacking.\n(Units steal an extra Gig for every 10 power.)",
  color: "green",
  classifications: ["Arasaka", "Corpo"],
  set: {
    code: "boxtoppersretail",
    name: "Box Toppers — Retail",
  },
  printNumber: "004",
  printings: [
    {
      id: "77e482f2-6090-47e9-9d03-be28417cb1cb",
      collectorNumber: "004",
      setCode: "boxtoppersretail",
      rarity: "Epic",
    },
    {
      id: "6ac7adce-01af-4b5b-956b-698eda0bed14",
      collectorNumber: "013",
      setCode: "embracingpowerretailstarterdeck",
      rarity: "Epic",
    },
    {
      id: "0cb4ae83-a7ca-4ca6-9c83-6c0581baae57",
      collectorNumber: "β004",
      setCode: "boxtoppersbeta",
      rarity: "Epic",
    },
    {
      id: "54136fbd-ce97-4d23-a8e8-f876e3e64819",
      collectorNumber: "β013",
      setCode: "embracingpowerbetastarterdeck",
      rarity: "Epic",
    },
  ],
  selectedPrintingId: "77e482f2-6090-47e9-9d03-be28417cb1cb",
  artist: "ADIA",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/boxtoppersretail/004.webp",
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
      kind: "static",
      text: "Friendly ARASAKA Units have +1 power while attacking.",
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "modifyPower",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["field"],
            cardTypes: ["unit"],
            classifications: ["Arasaka"],
          },
          value: 1,
          duration: "continuous",
          conditions: [
            {
              condition: "attacking",
              target: {
                selector: "self",
              },
            },
          ],
        },
      ],
    },
  ],
  reminderText: ["Units steal an extra Gig for every 10 power."],
} satisfies StructuredCardDefinition;
