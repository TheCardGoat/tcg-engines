import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailModdedKusanagi = {
  id: "920cabc9-f350-4f61-96c6-69e649271456",
  externalId: "cb-modded-kusanagi",
  slug: "modded-kusanagi",
  name: "Modded Kusanagi",
  displayName: "Modded Kusanagi",
  rulesText:
    "[ADRENALINE] (This Unit can attack the turn it's played.)\nAt the end of your turn, return this Unit to its owner's hand.",
  color: "blue",
  classifications: ["Tyger Claws", "Vehicle"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "120",
  printings: [
    {
      id: "50e8101a-3d0e-45ea-9444-22007f7f9cb0",
      collectorNumber: "120",
      setCode: "welcometonightcityretail",
      rarity: "Common",
    },
    {
      id: "ee22b73e-8b14-4225-9c86-428cfada892f",
      collectorNumber: "β120",
      setCode: "welcometonightcitybeta",
      rarity: "Common",
    },
  ],
  selectedPrintingId: "50e8101a-3d0e-45ea-9444-22007f7f9cb0",
  artist: "Łukasz Poller",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/120.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: [],
  keywords: ["adrenaline"],
  type: "unit",
  cost: 6,
  power: 8,
  abilities: [
    {
      kind: "keyword",
      text: "ADRENALINE (This Unit can attack the turn it's played.)",
      keyword: "adrenaline",
      source: {
        selector: "self",
      },
      effects: [],
    },
    {
      kind: "triggered",
      text: "At the end of your turn, return this Unit to its owner's hand.",
      trigger: {
        trigger: "event",
        event: {
          event: "turnEnded",
          player: "friendly",
        },
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "returnToHand",
          target: {
            selector: "self",
          },
          destinationOwner: "owner",
        },
      ],
    },
  ],
  reminderText: [],
} satisfies StructuredCardDefinition;
