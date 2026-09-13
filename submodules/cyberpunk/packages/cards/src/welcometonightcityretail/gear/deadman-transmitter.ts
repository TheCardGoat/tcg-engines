import type { GearCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailDeadmanTransmitter = defineCyberpunkCard({
  id: "1d8f611c-dd08-48d1-82eb-451d56dcf651",
  canonicalId: "deadman-transmitter",
  slug: "deadman-transmitter",
  name: "Deadman Transmitter",
  displayName: "Deadman Transmitter",
  rulesText:
    '(Equip to a friendly Unit or face-up Legend.)\nIf this Unit would be defeated, defeat its "DEADMAN TRANSMITTER" instead.',
  color: "red",
  classifications: ["Cyberware", "Trauma Team"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "024",
  artist: "ADIA",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/024.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: true,
  ram: 3,
  abilities: [
    {
      kind: "static",
      text: 'If this Unit would be defeated, defeat its "DEADMAN TRANSMITTER" instead.',
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "grantRule",
          target: {
            selector: "self",
          },
          rule: "sacrificeInsteadOfHostDefeat",
          duration: "continuous",
        },
      ],
    },
  ],
  type: "gear",
  cost: 3,
  power: 1,
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
