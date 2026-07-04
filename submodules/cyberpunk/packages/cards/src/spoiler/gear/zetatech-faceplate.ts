import type { GearCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const spoilerZetatechFaceplate = defineCyberpunkCard({
  id: "eead1bba-f247-423e-a4f5-b330945887b0",
  slug: "zetatech-faceplate",
  rulesText:
    "(Equip to a friendly Unit or face-up Legend.) When this Unit or Legend is spent, adjust a Gig by up to 1. Then, if you control 3 or more Gigs with different values, draw 1.",
  name: "Zetatech Faceplate",
  displayName: "Zetatech Faceplate",
  canonicalId: "zetatech-faceplate",
  color: "yellow",
  classifications: ["Cyberware", "Zetatech"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "064",
  artist: "ADIA",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/spoiler/064.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  type: "gear",
  cost: 2,
  power: 2,
  abilities: [
    {
      kind: "triggered",
      text: "When this Unit or Legend is spent, adjust a Gig by up to 1. Then, if you control 3 or more Gigs with different values, draw 1.",
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
      bindings: [
        {
          id: "selectedGig",
          target: {
            selector: "gig",
            amount: 1,
            selection: {
              mode: "choose",
              min: 0,
              max: 1,
            },
          },
        },
      ],
      effects: [
        {
          effect: "adjustGig",
          target: {
            selector: "bound",
            id: "selectedGig",
          },
          maxAmount: 1,
          direction: "either",
          chooseUpTo: true,
        },
        {
          effect: "draw",
          player: "friendly",
          amount: 1,
          conditions: [
            {
              condition: "hasDistinctGigValues",
              controller: "friendly",
              minCount: 3,
            },
          ],
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
