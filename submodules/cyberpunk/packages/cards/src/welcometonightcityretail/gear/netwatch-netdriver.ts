import type { GearCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailNetwatchNetdriver = defineCyberpunkCard({
  id: "40c98fdc-45d0-458d-be2c-2697dc337ca5",
  canonicalId: "netwatch-netdriver",
  slug: "netwatch-netdriver",
  name: "NetWatch Netdriver",
  displayName: "NetWatch Netdriver",
  rulesText:
    "(Equip to a friendly Unit or face-up Legend.)\nWhen this Unit or Legend is spent, draw 1.",
  color: "blue",
  classifications: ["Cyberware", "Netrunner", "Netwatch"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "129",
  artist: "Mooncolony",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/129.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  abilities: [
    {
      kind: "triggered",
      text: "When this Unit or Legend is spent, draw 1.",
      trigger: {
        trigger: "event",
        event: {
          event: "cardSpent",
          player: "friendly",
          target: {
            selector: "host",
          },
        },
      },
      source: {
        selector: "host",
      },
      effects: [
        {
          effect: "draw",
          player: "friendly",
          amount: 1,
        },
      ],
    },
  ],
  type: "gear",
  cost: 3,
  power: 2,
  attachment: {
    text: "Equip to a unit or face-up legend.",
    target: {
      selector: "card",
      controller: "friendly",
      zones: ["field", "legendArea"],
      cardTypes: ["unit", "legend"],
      face: "faceUp",
    },
  },
}) satisfies GearCardDefinition;
