import type { GearCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailGorillaArms = defineCyberpunkCard({
  id: "500ae9b9-0afa-4b82-87ed-61c72583139c",
  slug: "gorilla-arms",
  rulesText:
    "(Equip to a friendly Unit or face-up Legend.)\nThe first time this Unit steals 1 or more Gigs each turn, steal a rival Gig with a value not shared by a friendly Gig.",
  name: "Gorilla Arms",
  displayName: "Gorilla Arms",
  canonicalId: "gorilla-arms",
  color: "yellow",
  classifications: ["Cyberware"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "060",
  artist: "TOPDOG Entertainment",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/060.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: true,
  ram: 3,
  type: "gear",
  cost: 4,
  power: 3,
  abilities: [
    {
      kind: "triggered",
      text: "The first time this Unit steals 1 or more Gigs each turn, steal a rival Gig with a value not shared by a friendly Gig.",
      trigger: {
        trigger: "event",
        event: {
          event: "gigStolen",
          player: "friendly",
          target: {
            selector: "gig",
            controller: "rival",
          },
          minAmount: 1,
          source: {
            selector: "host",
          },
        },
      },
      source: {
        selector: "host",
      },
      limits: ["firstTimeEachTurn"],
      effects: [
        {
          effect: "stealGig",
          target: {
            selector: "gig",
            controller: "rival",
            valueNotSharedBy: {
              selector: "gig",
              controller: "friendly",
              amount: "all",
            },
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
        },
      ],
    },
  ],
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
